import { db } from "@/db/client";
import { articles } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function listArticles() {
  return db.select().from(articles).orderBy(desc(articles.createdAt)).limit(50);
}
export async function getArticleBySlug(slug: string) {
  return (await db.select().from(articles).where(eq(articles.slug, slug)).limit(1))[0] ?? null;
}
export async function createArticle(data: { title: string; slug: string; summary?: string; content?: string; lang?: string; createdBy?: string; }) {
  await db.insert(articles).values({ ...data, lang: data.lang ?? "el" });
}
export async function updateArticle(slug: string, data: { title?: string; slug?: string; summary?: string; content?: string; lang?: string; }) {
  await db.update(articles).set(data).where(eq(articles.slug, slug));
}
