import { describe, expect, it } from "vitest";
import { PublicLeadSchema } from "./crm.public-lead.schema";

const validLead = {
  companyName: "Workshop",
  contactName: "Contact",
  email: "contact@example.org",
  sector: "industrial" as const,
};

describe("anonymous CRM lead input", () => {
  it("accepts valid requests and trims surrounding whitespace", () => {
    const parsed = PublicLeadSchema.parse({
      ...validLead,
      companyName: "  Workshop  ",
      contactName: "  Contact ",
      email: " contact@example.org ",
      notes: " Details ",
    });
    expect(parsed).toMatchObject({ ...validLead, notes: "Details" });
  });

  it("rejects forged lifecycle status and unexpected fields", () => {
    expect(PublicLeadSchema.safeParse({ ...validLead, status: "cerrado" }).success).toBe(false);
    expect(PublicLeadSchema.safeParse({ ...validLead, isAdmin: true }).success).toBe(false);
  });

  it("rejects blank names after trimming", () => {
    expect(PublicLeadSchema.safeParse({ ...validLead, companyName: "   " }).success).toBe(false);
    expect(PublicLeadSchema.safeParse({ ...validLead, contactName: "\n " }).success).toBe(false);
  });

  it("rejects oversized payloads before database access", () => {
    expect(PublicLeadSchema.safeParse({ ...validLead, companyName: "a".repeat(201) }).success).toBe(false);
    expect(PublicLeadSchema.safeParse({ ...validLead, phone: "1".repeat(21) }).success).toBe(false);
    expect(PublicLeadSchema.safeParse({ ...validLead, polygon: "a".repeat(201) }).success).toBe(false);
    expect(PublicLeadSchema.safeParse({ ...validLead, notes: "a".repeat(4001) }).success).toBe(false);
  });

  it("preserves valid boundary lengths", () => {
    expect(PublicLeadSchema.safeParse({ ...validLead, phone: "1".repeat(20), notes: "a".repeat(4000) }).success).toBe(true);
  });
});
