import { db } from "@/db/client";
import { articles } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";

export async function listLatestArticles(lang: string, limit = 3) {
  return await db
    .select()
    .from(articles)
    .where(eq(articles.lang, lang))
    .orderBy(desc(articles.createdAt))
    .limit(limit);
}

export async function listAllArticles(lang: string) {
  return await db
    .select()
    .from(articles)
    .where(eq(articles.lang, lang))
    .orderBy(desc(articles.createdAt));
}

export async function getArticleBySlug(slug: string, lang: string) {
  const result = await db
    .select()
    .from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.lang, lang)))
    .limit(1);
  
  return result[0] || null;
}

export async function createArticle(data: {
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  lang: string;
  createdBy?: string;
}) {
  const [article] = await db
    .insert(articles)
    .values(data)
    .returning();
  
  return article;
}

export async function updateArticle(id: number, data: Partial<{
  title: string;
  slug: string;
  summary: string;
  content: string;
}>) {
  const [article] = await db
    .update(articles)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(articles.id, id))
    .returning();
  
  return article;
}

export async function deleteArticle(id: number) {
  await db
    .delete(articles)
    .where(eq(articles.id, id));
}