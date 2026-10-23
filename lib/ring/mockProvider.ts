import { RingEventProvider } from "./eventProvider";
import { NormalizedRingEvent, normalizeRingPayload } from "./normalizeEvent";
import demoEventJson from "../../data/demo-event.json";

export class MockRingProvider implements RingEventProvider {
  private demoEvent: NormalizedRingEvent;

  constructor() {
    this.demoEvent = normalizeRingPayload(demoEventJson, "mock");
  }

  async getLatestEvent(): Promise<NormalizedRingEvent> {
    return {
      ...this.demoEvent,
      source: "mock",
    };
  }

  async getEventById(id: string): Promise<NormalizedRingEvent | null> {
    if (this.demoEvent.event_id === id) {
      return this.demoEvent;
    }
    return null;
  }

  isSimulated(): boolean {
    return true;
  }

  getSourceLabel(): string {
    return "SIMULATED (MOCK_RING)";
  }
}
