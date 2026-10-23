import { NextResponse } from "next/server";
import { z } from "zod";
import { getHouseholdStore } from "@/lib/store/inMemoryStore";
import { getGuardianEngine } from "@/lib/guardian/bedrockEngine";

const DecideRequestSchema = z.object({
  event_id: z.string(),
  household_context: z.record(z.any()).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = DecideRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request payload",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const store = getHouseholdStore();
    const eventRecord = await store.getEvent(parsed.data.event_id);

    if (!eventRecord) {
      return NextResponse.json(
        {
          success: false,
          error: `Event ${parsed.data.event_id} not found`,
        },
        { status: 404 }
      );
    }

    const household = await store.getHouseholdConfig();
    const engine = getGuardianEngine();

    const decision = await engine.decide(eventRecord.event, household);
    const updatedRecord = await store.updateDecision(parsed.data.event_id, decision);

    return NextResponse.json({
      success: true,
      engine: engine.getEngineName(),
      decision,
      record: updatedRecord,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Guardian AI decision failed",
      },
      { status: 500 }
    );
  }
}
