import { NextResponse } from "next/server";
import { getHouseholdStore } from "@/lib/store/inMemoryStore";
import { getRingProvider } from "@/lib/ring/liveProvider";

export async function POST(req: Request) {
  try {
    const store = getHouseholdStore();
    const ringProvider = getRingProvider();

    // Reset store to pristine demo state if requested or initial load
    let reset = false;
    try {
      const body = await req.json();
      reset = Boolean(body?.reset);
    } catch {
      // empty body is acceptable
    }

    let record = reset
      ? await store.resetDemo()
      : await store.getEvent("ring-evt-20261024-001");

    if (!record) {
      record = await store.resetDemo();
    }

    const household = await store.getHouseholdConfig();

    return NextResponse.json({
      success: true,
      provider: {
        is_simulated: ringProvider.isSimulated(),
        label: ringProvider.getSourceLabel(),
      },
      household,
      record,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to initialize session",
      },
      { status: 500 }
    );
  }
}
