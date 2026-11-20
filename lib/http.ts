import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { authorized, findSite, rateLimit, ready, localMode } from "./store";
export async function guard(req: Request) {
  if (!ready())
    return NextResponse.json(
      {
        error:
          "Publishing is not configured yet. You can still explore the sample.",
      },
      { status: 503 },
    );
  if (
    req.headers.get("origin") !==
    (localMode()
      ? `http://${req.headers.get("host")}`
      : (process.env.APP_URL ?? new URL(req.url).origin))
  )
    return NextResponse.json(
      { error: "Request origin rejected" },
      { status: 403 },
    );
  if (Number(req.headers.get("content-length") ?? 0) > 16000)
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  if (!(await rateLimit("mutations")))
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
}
export async function body(req: Request) {
  const text = await req.text();
  if (text.length > 16000) throw new Error("Body too large");
  return JSON.parse(text);
}
export async function owned(id: string) {
  const site = await findSite(id);
  const key = (await cookies()).get("pp_session")?.value ?? "";
  return site && authorized(site, key) ? site : null;
}
export async function session(key: string) {
  (await cookies()).set("pp_session", key, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" && !localMode(),
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}
export function failure() {
  return NextResponse.json(
    { error: "We could not complete that request. Please try again." },
    { status: 503 },
  );
}
