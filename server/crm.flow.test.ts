import { afterEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { appRouter } from "./routers";
import { getDb } from "./db";
import { automations, leads } from "../drizzle/schema";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;
const testEmail = "crm-flow-test@example.com";
const automationName = "CRM Flow Automation";

function createContext(role: "admin" | "user"): TrpcContext {
  const user: AuthenticatedUser = {
    id: role === "admin" ? 1 : 2,
    openId: `${role}-crm-test`,
    email: `${role}@example.com`,
    name: role === "admin" ? "CRM Admin" : "CRM User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

afterEach(async () => {
  const db = await getDb();
  if (db) {
    await db.delete(leads).where(eq(leads.email, testEmail));
    await db.delete(automations).where(eq(automations.name, automationName));
  }
});

describe("crm lead flow", () => {
  it("creates publicly, lists as admin and updates lead status", async () => {
    const publicCaller = appRouter.createCaller({ ...createContext("user"), user: null });
    const adminCaller = appRouter.createCaller(createContext("admin"));

    await publicCaller.crm.createLead({
      companyName: "CRM Flow Company",
      contactName: "CRM Flow Contact",
      email: testEmail,
      sector: "industrial",
      notes: "Flow verification",
    });

    const before = await adminCaller.crm.getLeads();
    const created = before.find((lead) => lead.email === testEmail);
    expect(created?.status).toBe("prospectado");
    expect(created?.companyName).toBe("CRM Flow Company");

    await adminCaller.crm.updateLeadStatus({ leadId: created!.id, status: "cerrado" });
    const after = await adminCaller.crm.getLeads();
    expect(after.find((lead) => lead.id === created!.id)?.status).toBe("cerrado");
  });

  it("supports AutomationPanel CRUD and rejects private access for non-admin users", async () => {
    const adminCaller = appRouter.createCaller(createContext("admin"));
    const userCaller = appRouter.createCaller(createContext("user"));

    const created = await adminCaller.automations.create({
      name: automationName,
      description: "Test workflow",
      trigger: "new_lead",
      action: "send_notification",
    });
    expect(created?.isActive).toBe(1);

    const updated = await adminCaller.automations.update({ id: created!.id, isActive: 0, description: "Updated workflow" });
    expect(updated?.isActive).toBe(0);
    expect(updated?.description).toBe("Updated workflow");

    const inactive = await adminCaller.automations.list();
    expect(inactive.find((item) => item.id === created!.id)?.isActive).toBe(0);

    await adminCaller.automations.delete({ id: created!.id });
    expect((await adminCaller.automations.list()).some((item) => item.id === created!.id)).toBe(false);

    await expect(userCaller.crm.getLeads()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(userCaller.automations.list()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(userCaller.automations.create({ name: automationName, trigger: "new_lead", action: "send_notification" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
