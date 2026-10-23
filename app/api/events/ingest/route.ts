import { NextResponse } from "next/server";
import { getHouseholdStore } from "@/lib/store/inMemoryStore";
import { NormalizedRingEventSchema } from "@/lib/ring/normalizeEvent";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parseResult = NormalizedRingEventSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Ring event payload",
          details: parseResult.error.format(),
        },
        { status: 400 }
      );
    }

    const store = getHouseholdStore();
    const existing = await store.getEvent(parseResult.data.event_id);

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Event already ingested (duplicate prevented)",
        record: existing,
      });
    }

    const record = await store.ingestEvent(parseResult.data);
    return NextResponse.json({
      success: true,
      message: "Event ingested successfully",
      record,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to ingest event",
      },
      { status: 500 }
    );
  }
}
