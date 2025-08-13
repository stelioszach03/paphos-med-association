import { Lucia } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "@/db/client";
import { users, sessions } from "@/db/schema";

export const lucia = new Lucia(
  new DrizzlePostgreSQLAdapter(db, sessions, users),
  { 
    sessionCookie: { 
      attributes: { secure: process.env.NODE_ENV === "production" } 
    },
    getUserAttributes: (attributes) => {
      return {
        email: attributes.email,
        fullName: attributes.full_name
      };
    }
  }
);

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: { 
      email: string; 
      full_name: string | null;
    };
  }
}