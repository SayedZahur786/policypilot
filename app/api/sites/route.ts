import { NextResponse } from "next/server";
import { intakeSchema } from "@/lib/schema";
import { createSite, newKey } from "@/lib/store";
import { body, guard, session, failure } from "@/lib/http";
export async function POST(req: Request) {
  try {
    const denied = await guard(req);
    if (denied) return denied;
    const parsed = intakeSchema.safeParse(await body(req));
    if (!parsed.success)
      return NextResponse.json(
        {
          error: "Please check all ten answers and confirm the review notice.",
        },
        { status: 400 },
      );
    const key = newKey();
    const site = await createSite(parsed.data, key);
    await session(key);
    return NextResponse.json(
      { id: site.id, slug: site.slug, key },
      { status: 201 },
    );
  } catch {
    return failure();
  }
}
