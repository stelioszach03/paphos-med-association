import "server-only";
import { cookies } from "next/headers";
import { lucia } from "./lucia";

export async function validateRequest() {
  const cookie = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!cookie) return { user: null, session: null } as const;
  try {
    const session = await lucia.validateSession(cookie);
    if (!session?.user) return { user: null, session: null } as const;
    return { user: session.user, session } as const;
  } catch {
    return { user: null, session: null } as const;
  }
}
