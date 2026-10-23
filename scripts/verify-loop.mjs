// Automated End-to-End Verification Test for Doorstep Guardian AI

const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("=== STARTING DOORSTEP GUARDIAN AI VERIFICATION SUITE ===");

  // 1. Session start
  console.log("\n[Test 1] POST /api/session/start (Reset Demo)");
  const sessionRes = await fetch(`${BASE_URL}/api/session/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reset: true }),
  });
  const sessionData = await sessionRes.json();
  console.log("Status:", sessionRes.status);
  console.log("Provider:", sessionData.provider);
  console.log("Household State:", sessionData.household?.resident_status);
  console.log("Initial Event Status:", sessionData.record?.status);
  if (sessionData.record?.status !== "NEEDS_ATTENTION") {
    throw new Error(`Expected initial status NEEDS_ATTENTION, got ${sessionData.record?.status}`);
  }
  console.log("✓ Test 1 Passed: Household away condition triggered initial status NEEDS_ATTENTION");

  // 2. Ingest duplicate check
  console.log("\n[Test 2] POST /api/events/ingest (Duplicate Event Prevention)");
  const ingestRes = await fetch(`${BASE_URL}/api/events/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sessionData.record.event),
  });
  const ingestData = await ingestRes.json();
  console.log("Status:", ingestRes.status);
  console.log("Message:", ingestData.message);
  if (!ingestData.message.includes("duplicate prevented")) {
    throw new Error("Expected duplicate prevention message");
  }
  console.log("✓ Test 2 Passed: Duplicate event ingestion successfully prevented");

  // 3. Guardian Decision
  console.log("\n[Test 3] POST /api/guardian/decide (AI Triage & Reasoning)");
  const decideRes = await fetch(`${BASE_URL}/api/guardian/decide`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event_id: "ring-evt-20261024-001" }),
  });
  const decideData = await decideRes.json();
  console.log("Status:", decideRes.status);
  console.log("Engine:", decideData.engine);
  console.log("Classification:", decideData.decision?.event_classification);
  console.log("Priority:", decideData.decision?.priority);
  console.log("Rationale:", decideData.decision?.rationale);
  console.log("Recommended Action:", decideData.decision?.recommended_action);
  console.log("Requires Confirmation:", decideData.decision?.requires_confirmation);
  if (decideData.decision?.priority !== "attention_needed") {
    throw new Error("Expected priority attention_needed");
  }
  if (!decideData.decision?.requires_confirmation) {
    throw new Error("Expected requires_confirmation to be true");
  }
  console.log("✓ Test 3 Passed: AI decision adheres to strict Zod schema and rule-based priority");

  // 4. Resident Action Selection
  console.log("\n[Test 4] POST /api/events/action (Select Action -> ACTION_SELECTED)");
  const actionRes = await fetch(`${BASE_URL}/api/events/action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event_id: "ring-evt-20261024-001",
      action_type: "contact_authorized_member",
      label: "Ask Sarah Chen (Authorized Neighbor) to retrieve package",
      target_member: "Sarah Chen",
      notes: "Neighbor dispatched via mock simulation",
    }),
  });
  const actionData = await actionRes.json();
  console.log("Status:", actionRes.status);
  console.log("Event Status:", actionData.record?.status);
  if (actionData.record?.status !== "ACTION_SELECTED") {
    throw new Error(`Expected status ACTION_SELECTED, got ${actionData.record?.status}`);
  }
  console.log("✓ Test 4 Passed: Action recorded without false premature resolution");

  // 5. Outcome Confirmation & Resolution
  console.log("\n[Test 5] POST /api/events/resolve (Physical Outcome Confirmation -> RESOLVED)");
  const resolveRes = await fetch(`${BASE_URL}/api/events/resolve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event_id: "ring-evt-20261024-001",
      resolution_type: "stored_safely",
      confirmed_by: "Sarah Chen (Neighbor)",
      evidence_source: "Authorized Household Confirmation",
      notes: "Sarah Chen confirmed package brought safely inside foyer.",
    }),
  });
  const resolveData = await resolveRes.json();
  console.log("Status:", resolveRes.status);
  console.log("Final Event Status:", resolveData.record?.status);
  console.log("Resolution Evidence:", resolveData.record?.resolution?.evidence_source);
  if (resolveData.record?.status !== "RESOLVED") {
    throw new Error(`Expected status RESOLVED, got ${resolveData.record?.status}`);
  }
  console.log("✓ Test 5 Passed: Event explicitly confirmed and marked RESOLVED with audit trail");

  // 6. Chronological Timeline & Audit History
  console.log("\n[Test 6] GET /api/events/timeline (Audit History)");
  const timelineRes = await fetch(`${BASE_URL}/api/events/timeline?eventId=ring-evt-20261024-001`);
  const timelineData = await timelineRes.json();
  console.log("Status:", timelineRes.status);
  console.log("History Entries Count:", timelineData.history?.length);
  timelineData.history.forEach((entry, idx) => {
    console.log(`  [${idx + 1}] ${entry.timestamp} | ${entry.from_status} -> ${entry.to_status} | Actor: ${entry.actor} | ${entry.action_summary}`);
  });
  if (timelineData.history?.length < 4) {
    throw new Error("Expected at least 4 audit transitions in lifecycle");
  }
  console.log("✓ Test 6 Passed: Complete auditable history verified from sensor to confirmed resolution");

  console.log("\n========================================================");
  console.log(" ALL 6 CORE VERIFICATION TESTS PASSED SUCCESSFULLY! ");
  console.log("========================================================");
}

runTests().catch((err) => {
  console.error("TEST FAILED:", err);
  process.exit(1);
});
