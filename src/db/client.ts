import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const connectionString = process.env.DATABASE_URL;
export const db = connectionString ? drizzle(neon(connectionString)) : ({} as any);