import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { db, schema } from "@nuxthub/db";
import { isSignupEmailAllowed } from "./is-signup-email-allowed";

const productionUrl = process.env.BETTER_AUTH_URL?.trim();

export const auth = betterAuth({
  baseURL: productionUrl,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: productionUrl ? [productionUrl] : undefined,
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (!isSignupEmailAllowed(user.email)) {
            throw new APIError("FORBIDDEN", {
              message: "This email is not allowed to sign up.",
            });
          }
          return { data: user };
        },
      },
    },
  },
});
