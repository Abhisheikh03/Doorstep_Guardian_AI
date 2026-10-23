import { NextResponse } from "next/server";
import { z } from "zod";
import { getHouseholdStore } from "@/lib/store/inMemoryStore";

const ActionRequestSchema = z.object({
  event_id: z.string(),
  action_type: z.enum(["collect_package", "contact_authorized_member", "dismiss"]),
  label: z.string(),
  notes: z.string().optional(),
  target_member: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ActionRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid action request payload",
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

    const updated = await store.recordAction(parsed.data.event_id, {
      action_type: parsed.data.action_type,
      label: parsed.data.label,
      notes: parsed.data.notes,
      target_member: parsed.data.target_member,
      selected_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Resident action recorded. Follow-up status updated to ACTION_SELECTED.",
      record: updated,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to record action",
      },
      { status: 500 }
    );
  }
}
