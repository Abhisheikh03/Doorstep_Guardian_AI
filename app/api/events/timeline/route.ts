import { NextResponse } from "next/server";
import { getHouseholdStore } from "@/lib/store/inMemoryStore";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId") || "ring-evt-20261024-001";

    const store = getHouseholdStore();
    const record = await store.getEvent(eventId);

    if (!record) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      event_id: eventId,
      status: record.status,
      history: record.history,
      record,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch timeline",
      },
      { status: 500 }
    );
  }
}
