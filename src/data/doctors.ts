import { db } from "@/db/client";
import { doctors } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getDoctorById(id: string) {
  const result = await db
    .select()
    .from(doctors)
    .where(eq(doctors.id, id))
    .limit(1);
  
  return result[0] || null;
}

export async function getDoctorCount() {
  const result = await db.select().from(doctors);
  return result.length;
}