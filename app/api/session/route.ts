import { NextResponse } from "next/server";
import { authorized, findSite } from "@/lib/store";
import { body, guard, session, failure } from "@/lib/http";
export async function POST(req: Request) {
  try {
    const denied = await guard(req);
    if (denied) return denied;
    const b = await body(req);
    if (
      typeof b.id !== "string" ||
      typeof b.key !== "string" ||
      b.key.length > 100
    )
      return NextResponse.json(
        { error: "Enter your site ID and recovery key." },
        { status: 400 },
      );
    const site = await findSite(b.id);
    if (!site || !authorized(site, b.key))
      return NextResponse.json(
        { error: "Site or recovery key not recognized" },
        { status: 403 },
      );
    await session(b.key);
    return NextResponse.json({ id: site.id });
  } catch {
    return failure();
  }
}
