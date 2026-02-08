import { db } from "./db";

// Initialize subscription tables
export async function initSubscriptionTables() {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL UNIQUE,
      stripeCustomerId TEXT,
      stripeSubscriptionId TEXT,
      status TEXT NOT NULL DEFAULT 'inactive',
      currentPeriodEnd INTEGER,
      createdAt INTEGER DEFAULT (unixepoch()),
      updatedAt INTEGER DEFAULT (unixepoch())
    );
    CREATE TABLE IF NOT EXISTS usage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT NOT NULL,
      month TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 0,
      UNIQUE(userId, month)
    );
  `);
}

// Check if user has active subscription
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const result = await db.execute({
    sql: "SELECT id FROM subscriptions WHERE userId = ? AND status = 'active' AND currentPeriodEnd > unixepoch()",
    args: [userId],
  });
  return result.rows.length > 0;
}

// Get subscription record
export async function getSubscription(userId: string) {
  const result = await db.execute({
    sql: "SELECT * FROM subscriptions WHERE userId = ?",
    args: [userId],
  });
  return result.rows[0] ?? null;
}

// Upsert subscription
export async function upsertSubscription(data: {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: string;
  currentPeriodEnd: number;
}) {
  await db.execute({
    sql: `INSERT INTO subscriptions (id, userId, stripeCustomerId, stripeSubscriptionId, status, currentPeriodEnd)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(userId) DO UPDATE SET
        stripeCustomerId = excluded.stripeCustomerId,
        stripeSubscriptionId = excluded.stripeSubscriptionId,
        status = excluded.status,
        currentPeriodEnd = excluded.currentPeriodEnd,
        updatedAt = unixepoch()`,
    args: [
      crypto.randomUUID(),
      data.userId,
      data.stripeCustomerId,
      data.stripeSubscriptionId,
      data.status,
      data.currentPeriodEnd,
    ],
  });
}

// Check and increment usage (returns true if under limit)
export async function checkAndIncrementUsage(userId: string, limit: number = 50): Promise<boolean> {
  const month = new Date().toISOString().slice(0, 7); // YYYY-MM
  const result = await db.execute({
    sql: "SELECT count FROM usage WHERE userId = ? AND month = ?",
    args: [userId, month],
  });

  if (result.rows.length === 0) {
    await db.execute({
      sql: "INSERT INTO usage (userId, month, count) VALUES (?, ?, 1)",
      args: [userId, month],
    });
    return true;
  }

  const count = result.rows[0].count as number;
  if (count >= limit) return false;

  await db.execute({
    sql: "UPDATE usage SET count = count + 1 WHERE userId = ? AND month = ?",
    args: [userId, month],
  });
  return true;
}

// Map stripe customer to user
export async function getUserByStripeCustomer(stripeCustomerId: string) {
  const result = await db.execute({
    sql: "SELECT userId FROM subscriptions WHERE stripeCustomerId = ?",
    args: [stripeCustomerId],
  });
  return result.rows[0] as unknown as { userId: string } | undefined;
}

// Initialize tables on import
initSubscriptionTables().catch(() => { /* db might not exist yet */ });
