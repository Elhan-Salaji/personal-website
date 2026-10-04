"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthConfig } from "@/lib/auth/config";
import { isPasswordCorrect } from "@/lib/auth/password";
import { FailedAttemptLimiter } from "@/lib/auth/rate-limit";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/auth/session";

export interface LoginState {
  error?: string;
}

const COOKIE_PATH = "/kalender";
const MAX_PASSWORD_LENGTH = 256;

// 5 Fehlversuche pro IP in 15 Minuten. Grenzen siehe rate-limit.ts.
const limiter = new FailedAttemptLimiter(5, 15 * 60 * 1000);

async function clientIp(): Promise<string> {
  const requestHeaders = await headers();
  // Vercel setzt x-real-ip selbst, der Wert lässt sich vom Client nicht fälschen.
  return (
    requestHeaders.get("x-real-ip") ??
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unbekannt"
  );
}

export async function login(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const config = getAuthConfig();
  if (!config) {
    return { error: "Der Kalender ist noch nicht eingerichtet." };
  }

  const ip = await clientIp();
  const waitMs = limiter.retryAfterMs(ip);
  if (waitMs > 0) {
    const minutes = Math.ceil(waitMs / 60_000);
    return { error: `Zu viele Fehlversuche. Bitte in ${minutes} ${minutes === 1 ? "Minute" : "Minuten"} erneut versuchen.` };
  }

  const input = formData.get("password");
  if (typeof input !== "string" || input.length === 0 || input.length > MAX_PASSWORD_LENGTH) {
    return { error: "Bitte ein Passwort eingeben." };
  }

  if (!isPasswordCorrect(input, config.password)) {
    limiter.recordFailure(ip);
    return { error: "Das Passwort stimmt nicht." };
  }

  limiter.reset(ip);
  (await cookies()).set(SESSION_COOKIE_NAME, createSessionToken(config.secret, config.password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: COOKIE_PATH,
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  redirect("/kalender");
}

export async function logout(): Promise<void> {
  // delete() nutzt immer den Pfad "/", das Cookie liegt aber unter /kalender.
  (await cookies()).set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: COOKIE_PATH,
    maxAge: 0,
  });
  redirect("/kalender");
}
