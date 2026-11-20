import { NextResponse } from "next/server";
import { localMode, markPaid } from "@/lib/store";
import { body, guard, owned, failure } from "@/lib/http";
export async function POST(req: Request) {
  if (!localMode()) return new NextResponse(null, { status: 404 });
  try {
    const denied = await guard(req);
    if (denied) return denied;
    const b = await body(req);
    if (typeof b.id !== "string" || !(await owned(b.id)))
      return new NextResponse(null, { status: 403 });
    await markPaid(b.id, `local-${b.id}`);
    return NextResponse.json({ ok: true });
  } catch {
    return failure();
  }
}
