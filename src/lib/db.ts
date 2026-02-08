import { createClient } from "@libsql/client";

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:./auth.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
