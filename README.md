# Doorstep Guardian AI — Amazon Ring Home Safety System

> **Agentic Home-Safety Assistant**: Transforming Ring doorstep events into contextual, trackable outcomes instead of passive notifications.

---

## 🎯 The Core Differentiator

| Traditional Smart Security | Doorstep Guardian AI |
| :--- | :--- |
| **Notifies & Forgets**: Sends an alert that a package was delivered or motion occurred. | **Contextual & Trackable**: Combines doorstep events with household rules to identify if follow-up is needed. |
| **Assumes Notification = Resolution**: Closes the event as soon as the push notification is delivered. | **Never Confuses Notification with Resolution**: Follow-up stays active until physical retrieval is verified. |
| **Passive & Overwhelming**: Floods residents with disjointed alerts while they are away. | **Agentic Action**: Evaluates known facts vs. unknowns, recommends trusted household actions, and keeps an auditable timeline. |

---

## 🚀 Quick Start

The prototype runs in local development mode with full simulated Ring hardware integration and deterministic AI reasoning:

```bash
# 1. Install dependencies
npm install

# 2. Run Next.js local server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎮 TV & Kiosk Keyboard Navigation

The UI provides accessible focus navigation for TV and smart display screens:

- `▲ / ▼` or `◀ / ▶`: Navigate between interactive buttons and action choices.
- `ENTER` / `SPACE`: Select the highlighted action.
- `BACKSPACE` / `ESC`: Go back to the previous screen.
- `R`: Reset the system state to the initial doorstep event.

---

## 🔄 The Autonomous Doorstep Safety Loop

1. **Detection (Home Safety Screen)**: A package delivery event arrives from the Ring Video Doorbell Pro while residents are away at the office (ETA 5:30 PM). Status initializes to `NEEDS_ATTENTION` under household Rule #104.
2. **Contextual Reasoning (Event Context Screen)**: The system decomposes the incident into **Observed Facts** (carrier, zone, timestamp), **Configured Rule** (unattended delivery policy), and **Crucial Unknowns** (package contents, ongoing physical presence).
3. **Structured Decision (Guardian Decision Screen)**: Guardian AI evaluates the context and outputs a validated decision (`priority: attention_needed`, recommended action: `contact_authorized_member`).
4. **Action Selection (Action Screen)**: The resident selects *Ask Sarah Chen (Authorized Neighbor)*. The status updates to `ACTION_SELECTED`. **The event is NOT resolved yet.**
5. **Outcome Confirmation (Resolution Screen)**: The resident records verified physical retrieval (*Sarah Chen confirmed package brought safely inside foyer*). Status transitions to `RESOLVED`.
6. **Resolution Summary (Closing Screen)**: The complete audit trail is displayed alongside the 6 core dimensions proving that the system tracked the incident to completion.

---

## 🧱 Architecture & Tech Stack

- **Framework**: Next.js 14 App Router + TypeScript + Tailwind CSS.
- **AI Engine**: Amazon Bedrock (`@aws-sdk/client-bedrock-runtime`) with fallback to deterministic rule engine (`MOCK_AI=true`).
- **Event Adapter**: `RingEventProvider` interface supporting simulated device mode (`MOCK_RING=true`) and live Ring API adapters.
- **Validation**: Strict runtime validation with `Zod` for event payloads and AI structured decisions.
- **State & Store**: `HouseholdEventStore` interface with in-memory store and duplicate-event protection.

---

## 🧪 Automated Verification Suite

Run the automated test suite to verify all endpoints and state transitions:

```bash
node scripts/verify-loop.mjs
```
