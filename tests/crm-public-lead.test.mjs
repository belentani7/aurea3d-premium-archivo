import assert from "node:assert/strict";
import test from "node:test";
import { buildPublicLeadRecord } from "../server/crm.public-lead.ts";

const lead = {
  companyName: "Example Workshop",
  contactName: "Example Contact",
  email: "contact@example.org",
  sector: "industrial",
};

test("public submissions always begin as new prospects", () => {
  assert.equal(buildPublicLeadRecord(lead).status, "new");
});

test("forged lifecycle status cannot be persisted by the public mapper", () => {
  for (const status of ["converted", "cerrado", "qualified", "lost", null]) {
    assert.equal(buildPublicLeadRecord({ ...lead, status }).status, "new");
  }
});

test("contact details and optional notes survive mapping", () => {
  assert.deepEqual(buildPublicLeadRecord({ ...lead, phone: "+34 600000000", polygon: "Port", notes: "Details" }), {
    name: "Example Contact",
    email: "contact@example.org",
    phone: "+34 600000000",
    company: "Example Workshop",
    source: "industrial",
    status: "new",
    notes: "Polígono/puerto: Port\nDetails",
  });
});

test("mapping does not mutate the caller's data", () => {
  const input = Object.freeze({ ...lead, notes: "Original" });
  buildPublicLeadRecord(input);
  assert.equal(input.notes, "Original");
});
