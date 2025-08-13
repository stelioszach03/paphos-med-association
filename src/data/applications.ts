import { db } from "@/db/client";
import { applications } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function createApplication(data: {
  userId?: string;
  fullName: string;
  email: string;
  phone?: string;
  registryNo?: string;
  notes?: string;
}) {
  const [application] = await db
    .insert(applications)
    .values(data)
    .returning();
  
  return application;
}

export async function listApplications(status?: string) {
  if (status) {
    return await db
      .select()
      .from(applications)
      .where(eq(applications.status, status))
      .orderBy(desc(applications.createdAt));
  }
  
  return await db
    .select()
    .from(applications)
    .orderBy(desc(applications.createdAt));
}

export async function getApplicationById(id: number) {
  const result = await db
    .select()
    .from(applications)
    .where(eq(applications.id, id))
    .limit(1);
  
  return result[0] || null;
}

export async function updateApplicationStatus(id: number, status: string) {
  const [application] = await db
    .update(applications)
    .set({ status })
    .where(eq(applications.id, id))
    .returning();
  
  return application;
}

export async function getApplicationStatusCounts() {
  const apps = await db.select({ status: applications.status }).from(applications);
  const counts = { submitted: 0, approved: 0, rejected: 0 };
  apps.forEach(a => {
    if (a.status && (a.status in counts)) {
      counts[a.status as keyof typeof counts]++;
    }
  });
  return counts;
}