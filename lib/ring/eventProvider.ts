import { NormalizedRingEvent } from "./normalizeEvent";

export interface RingEventProvider {
  /**
   * Fetches the latest doorstep event.
   */
  getLatestEvent(): Promise<NormalizedRingEvent>;

  /**
   * Fetches an event by ID.
   */
  getEventById(id: string): Promise<NormalizedRingEvent | null>;

  /**
   * Returns whether this provider uses simulated data.
   */
  isSimulated(): boolean;

  /**
   * Human-readable provider label for the 10-foot UI indicator.
   */
  getSourceLabel(): string;
}
