import { NextResponse } from "next/server";
import { intakeSchema } from "@/lib/schema";
import { updateSite } from "@/lib/store";
import { body, guard, owned, failure } from "@/lib/http";
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const denied = await guard(req);
    if (denied) return denied;
    const { id } = await params;
    const site = await owned(id);
    if (!site)
      return NextResponse.json(
        { error: "Management access required" },
        { status: 403 },
      );
    const parsed = intakeSchema.safeParse(await body(req));
    if (!parsed.success)
      return NextResponse.json(
        { error: "Please check your answers." },
        { status: 400 },
      );
    await updateSite(id, parsed.data);
    return NextResponse.json({ slug: site.slug });
  } catch {
    return failure();
  }
}
