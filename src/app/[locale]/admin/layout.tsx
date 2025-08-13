import "server-only";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { ReactNode } from "react";
import { validateRequest } from "@/lib/auth/validateRequest";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { redirect } from "next/navigation";
import AdminNav from './AdminNav'

export default async function AdminLayout({ children, params }: { children: ReactNode; params: { locale: string } }) {
  const { user } = await validateRequest();
  try {
    await requireAdmin(user?.id ?? null);
  } catch {
    redirect(`/${params.locale}/login`);
  }

  return (
    <section className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-6">Admin</h1>
      <div className="sticky top-0 z-40 mb-6 border-b bg-background py-2">
        <AdminNav locale={params.locale} />
      </div>
      {children}
    </section>
  );
}
