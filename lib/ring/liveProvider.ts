import { RingEventProvider } from "./eventProvider";
import { NormalizedRingEvent, normalizeRingPayload } from "./normalizeEvent";

/**
 * Live Ring Event Provider adapter.
 * Uses officially supported Ring Webhook or Ring Device Simulator endpoint if configured.
 * Does not invent fake endpoints or credentials.
 */
export class LiveRingProvider implements RingEventProvider {
  private endpoint: string | null;
  private apiKey: string | null;

  constructor() {
    this.endpoint = process.env.RING_LIVE_API_ENDPOINT || null;
    this.apiKey = process.env.RING_API_KEY || null;
  }

  async getLatestEvent(): Promise<NormalizedRingEvent> {
    if (!this.endpoint) {
      throw new Error(
        "Live Ring integration is not configured. RING_LIVE_API_ENDPOINT is missing. Use MOCK_RING=true for the demonstration."
      );
    }

    try {
      const response = await fetch(`${this.endpoint}/doorstep/latest`, {
        headers: {
          Authorization: `Bearer ${this.apiKey || ""}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Ring live API returned status ${response.status}`);
      }

      const data = await response.json();
      return normalizeRingPayload(data, "live");
    } catch (error) {
      throw new Error(
        `Failed to reach Ring live endpoint: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async getEventById(id: string): Promise<NormalizedRingEvent | null> {
    if (!this.endpoint) return null;
    try {
      const response = await fetch(`${this.endpoint}/doorstep/events/${id}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey || ""}`,
        },
      });
      if (!response.ok) return null;
      const data = await response.json();
      return normalizeRingPayload(data, "live");
    } catch {
      return null;
    }
  }

  isSimulated(): boolean {
    return false;
  }

  getSourceLabel(): string {
    return "LIVE RING INTEGRATION";
  }
}

/**
 * Factory helper to get active event provider based on env.
 */
export function getRingProvider(): RingEventProvider {
  const isMock = process.env.MOCK_RING !== "false";
  if (isMock) {
    // Dynamic import avoidance in synchronous factory
    const { MockRingProvider } = require("./mockProvider");
    return new MockRingProvider();
  }
  return new LiveRingProvider();
}
