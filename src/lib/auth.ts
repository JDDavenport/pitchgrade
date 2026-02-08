import { betterAuth } from "better-auth";
import { LibsqlDialect } from "kysely-libsql";

export const auth = betterAuth({
  database: {
    dialect: new LibsqlDialect({
      url: process.env.TURSO_DATABASE_URL || "file:./auth.db",
      authToken: process.env.TURSO_AUTH_TOKEN,
    }),
    type: "sqlite",
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
});
