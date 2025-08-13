import "server-only";
export const runtime = "nodejs";
import { lucia } from "@/lib/auth/lucia";
import { cookies } from "next/headers";

export async function POST() {
  const cookie = cookies().get(lucia.sessionCookieName);
  if (cookie?.value) {
    await lucia.invalidateSession(cookie.value).catch(() => {});
  }
  const blank = lucia.createBlankSessionCookie();
  cookies().set(blank.name, blank.value, blank.attributes);
  return new Response(null, { status: 200 });
}
