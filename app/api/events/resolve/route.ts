import { NextResponse } from "next/server";
import { z } from "zod";
import { getHouseholdStore } from "@/lib/store/inMemoryStore";

const ResolveRequestSchema = z.object({
  event_id: z.string(),
  resolution_type: z.enum(["collected", "stored_safely", "dismissed"]),
  confirmed_by: z.string(),
  evidence_source: z.string(),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ResolveRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid resolution confirmation payload",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const store = getHouseholdStore();
    const record = await store.getEvent(parsed.data.event_id);

    if (!record) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    const updated = await store.confirmResolution(parsed.data.event_id, {
      event_id: parsed.data.event_id,
      resolution_type: parsed.data.resolution_type,
      confirmed_by: parsed.data.confirmed_by,
      evidence_source: parsed.data.evidence_source,
      notes: parsed.data.notes,
      confirmed_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Event outcome explicitly confirmed and resolved.",
      record: updated,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to confirm resolution",
      },
      { status: 500 }
    );
  }
}
