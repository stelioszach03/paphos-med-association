import { Lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "@/db/client";
import { users, sessions } from "@/db/schema";

export const lucia = new Lucia(
  new DrizzlePostgreSQLAdapter(db, sessions, users),
  { sessionCookie: { attributes: { secure: process.env.NODE_ENV === "production" } } }
);
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: { email: string; full_name: string | null };
  }
}