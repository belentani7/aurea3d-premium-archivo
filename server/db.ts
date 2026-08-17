import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  leads,
  Lead,
  InsertLead,
  automations,
  Automation,
  InsertAutomation,
  portfolioProjects,
  PortfolioProject,
  InsertPortfolioProject,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ÁUREA 3D: Lead queries
export async function createLead(lead: InsertLead): Promise<Lead | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create lead: database not available");
    return null;
  }

  try {
    const result = await db.insert(leads).values(lead);
    const leadId = result[0].insertId;
    const created = await db.select().from(leads).where(eq(leads.id, Number(leadId))).limit(1);
    return created.length > 0 ? created[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create lead:", error);
    throw error;
  }
}

export async function getLeads(filters?: { status?: string; limit?: number; offset?: number }): Promise<Lead[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get leads: database not available");
    return [];
  }

  try {
    let query: any = db.select().from(leads);
    if (filters?.status) {
      query = query.where(eq(leads.status, filters.status as any));
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.offset(filters.offset);
    }
    return await query;
  } catch (error) {
    console.error("[Database] Failed to get leads:", error);
    return [];
  }
}

export async function updateLeadStatus(leadId: number, status: string, internalNotes?: string): Promise<Lead | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update lead: database not available");
    return null;
  }

  try {
    const updateData: any = { status };
    if (internalNotes !== undefined) {
      updateData.internalNotes = internalNotes;
    }
    await db.update(leads).set(updateData).where(eq(leads.id, leadId));
    const updated = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
    return updated.length > 0 ? updated[0] : null;
  } catch (error) {
    console.error("[Database] Failed to update lead:", error);
    throw error;
  }
}

export async function getLeadById(leadId: number): Promise<Lead | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get lead: database not available");
    return null;
  }

  try {
    const result = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get lead:", error);
    return null;
  }
}

// AutomationPanel queries and mutations
export async function getAutomations(): Promise<Automation[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(automations);
}

export async function createAutomation(input: InsertAutomation): Promise<Automation | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(automations).values(input);
  const created = await db.select().from(automations).where(eq(automations.id, Number(result[0].insertId))).limit(1);
  return created[0] ?? null;
}

export async function updateAutomation(id: number, input: Partial<InsertAutomation>): Promise<Automation | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(automations).set(input).where(eq(automations.id, id));
  const updated = await db.select().from(automations).where(eq(automations.id, id)).limit(1);
  return updated[0] ?? null;
}

export async function deleteAutomation(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(automations).where(eq(automations.id, id));
}

// Portfolio queries and mutations
export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(portfolioProjects);
}

export async function createPortfolioProject(input: InsertPortfolioProject): Promise<PortfolioProject | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(portfolioProjects).values(input);
  const created = await db.select().from(portfolioProjects).where(eq(portfolioProjects.id, Number(result[0].insertId))).limit(1);
  return created[0] ?? null;
}

export async function updatePortfolioProject(id: number, input: Partial<InsertPortfolioProject>): Promise<PortfolioProject | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(portfolioProjects).set(input).where(eq(portfolioProjects.id, id));
  const updated = await db.select().from(portfolioProjects).where(eq(portfolioProjects.id, id)).limit(1);
  return updated[0] ?? null;
}

export async function deletePortfolioProject(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(portfolioProjects).where(eq(portfolioProjects.id, id));
}
