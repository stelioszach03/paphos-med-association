import "server-only";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { ReactNode } from "react";
import { validateRequest } from "@/lib/auth/validateRequest";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children, params }: { children: ReactNode; params: { locale: string } }) {
  const { user } = await validateRequest();
  try {
    await requireAdmin(user?.id ?? null);
  } catch {
    redirect(`/${params.locale}/login`);
  }

  return (
    <section className="container mx-auto py-8">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <nav className="flex gap-4 text-sm">
          <Link href={`/${params.locale}/admin/articles`}>Articles</Link>
          <Link href={`/${params.locale}/admin/announcements`}>Announcements</Link>
          <Link href={`/${params.locale}/admin/events`}>Events</Link>
          <Link href={`/${params.locale}/admin/applications`}>Applications</Link>
          <Link href={`/${params.locale}/admin/email`}>Email</Link>
          <Link href={`/${params.locale}/admin/zoom`}>Zoom</Link>
          <Link href={`/${params.locale}/admin/admins`}>Admins</Link>
        </nav>
      </header>
      {children}
    </section>
  );
}
