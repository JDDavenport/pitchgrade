import Database from "better-sqlite3";

// Reuse the same DB as auth
function getDb() {
  return new Database("./auth.db");
}

// Initialize subscription tables
export function initSubscriptionTables() {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
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
  db.close();
}

// Check if user has active subscription
export function hasActiveSubscription(userId: string): boolean {
  const db = getDb();
  try {
    const sub = db.prepare(
      "SELECT * FROM subscriptions WHERE userId = ? AND status = 'active' AND currentPeriodEnd > unixepoch()"
    ).get(userId) as { id: string } | undefined;
    return !!sub;
  } finally {
    db.close();
  }
}

// Get or create subscription record
export function getSubscription(userId: string) {
  const db = getDb();
  try {
    return db.prepare("SELECT * FROM subscriptions WHERE userId = ?").get(userId);
  } finally {
    db.close();
  }
}

// Upsert subscription
export function upsertSubscription(data: {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: string;
  currentPeriodEnd: number;
}) {
  const db = getDb();
  try {
    db.prepare(`
      INSERT INTO subscriptions (id, userId, stripeCustomerId, stripeSubscriptionId, status, currentPeriodEnd)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(userId) DO UPDATE SET
        stripeCustomerId = excluded.stripeCustomerId,
        stripeSubscriptionId = excluded.stripeSubscriptionId,
        status = excluded.status,
        currentPeriodEnd = excluded.currentPeriodEnd,
        updatedAt = unixepoch()
    `).run(
      crypto.randomUUID(),
      data.userId,
      data.stripeCustomerId,
      data.stripeSubscriptionId,
      data.status,
      data.currentPeriodEnd
    );
  } finally {
    db.close();
  }
}

// Check and increment usage (returns true if under limit)
export function checkAndIncrementUsage(userId: string, limit: number = 50): boolean {
  const db = getDb();
  try {
    const month = new Date().toISOString().slice(0, 7); // YYYY-MM
    const row = db.prepare(
      "SELECT count FROM usage WHERE userId = ? AND month = ?"
    ).get(userId, month) as { count: number } | undefined;

    if (!row) {
      db.prepare(
        "INSERT INTO usage (userId, month, count) VALUES (?, ?, 1)"
      ).run(userId, month);
      return true;
    }

    if (row.count >= limit) return false;

    db.prepare(
      "UPDATE usage SET count = count + 1 WHERE userId = ? AND month = ?"
    ).run(userId, month);
    return true;
  } finally {
    db.close();
  }
}

// Map stripe customer to user
export function getUserByStripeCustomer(stripeCustomerId: string) {
  const db = getDb();
  try {
    return db.prepare(
      "SELECT userId FROM subscriptions WHERE stripeCustomerId = ?"
    ).get(stripeCustomerId) as { userId: string } | undefined;
  } finally {
    db.close();
  }
}

// Initialize tables on import
try { initSubscriptionTables(); } catch { /* db might not exist yet */ }
