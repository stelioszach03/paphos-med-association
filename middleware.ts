import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["el","en","ru","zh"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/assets")
  ) return;

  // redirect root to default locale
  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/el";
    return NextResponse.redirect(url);
  }

  // ensure first segment is locale
  const seg = pathname.split("/")[1];
  if (!LOCALES.includes(seg)) {
    const url = req.nextUrl.clone();
    url.pathname = `/el${pathname.startsWith("/") ? "" : "/"}${pathname}`;
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/((?!.*\\.).*)"],
};
