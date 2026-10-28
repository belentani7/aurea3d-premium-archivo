import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { leads, visits, expenses, legalCompliance, quotations } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { buildPublicLeadRecord } from "./crm.public-lead";
import { PublicLeadSchema } from "./crm.public-lead.schema";

/**
 * CRM Router - Prospección B2B, Dietas, Anticipos, Cesión de Espacio
 */

const VisitSchema = z.object({
  leadId: z.number().optional(),
  visitDate: z.string(), // YYYY-MM-DD
  location: z.string().min(1),
  duration: z.number().optional(),
  kilometers: z.string(), // Decimal as string
  photoUrl: z.string().optional(),
  notes: z.string().optional(),
});

const ExpenseSchema = z.object({
  visitId: z.number().optional(),
  expenseType: z.enum(["dieta_instalacion", "dieta_prospección", "kilometraje", "material", "otro"]),
  amount: z.string(), // Decimal as string
  description: z.string().optional(),
  receiptUrl: z.string().optional(),
  date: z.string(), // YYYY-MM-DD
});

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next();
});

const QuotationSchema = z.object({
  leadId: z.number(),
  engineeringHours: z.string().optional(),
  engineeringCost: z.string().optional(),
  materialCost: z.string().optional(),
  material: z.string().optional(),
  postProcessingHours: z.string().optional(),
  postProcessingCost: z.string().optional(),
  description: z.string().optional(),
});

const statusToDb = {
  prospectado: "new",
  reunion_tecnica: "contacted",
  cotizacion_enviada: "qualified",
  cerrado: "converted",
  rechazado: "lost",
} as const;

const statusFromDb = {
  new: "prospectado",
  contacted: "reunion_tecnica",
  qualified: "cotizacion_enviada",
  converted: "cerrado",
  lost: "rechazado",
} as const;

const mapLeadForCrm = (lead: typeof leads.$inferSelect) => ({
  ...lead,
  companyName: lead.company ?? "",
  contactName: lead.name,
  sector: (["industrial", "nautica", "arquitectura"] as const).includes(lead.source as any)
    ? lead.source
    : "otro",
  polygon: undefined,
  status: statusFromDb[lead.status],
});

export const crmRouter = router({
  // LEADS MANAGEMENT
  createLead: publicProcedure
    .input(PublicLeadSchema)
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.insert(leads).values(buildPublicLeadRecord(input));

      return { success: true };
    }),

  getLeads: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const allLeads = await db.select().from(leads);
    return allLeads.map(mapLeadForCrm);
  }),

  updateLeadStatus: adminProcedure
    .input(z.object({ leadId: z.number(), status: z.enum(["prospectado", "reunion_tecnica", "cotizacion_enviada", "cerrado", "rechazado"]) }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.update(leads).set({ status: statusToDb[input.status] }).where(eq(leads.id, input.leadId));

      return { success: true };
    }),

  // VISITS MANAGEMENT
  createVisit: adminProcedure
    .input(VisitSchema)
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.insert(visits).values({
        leadId: input.leadId,
        visitDate: new Date(input.visitDate),
        location: input.location,
        duration: input.duration,
        kilometers: input.kilometers,
        photoUrl: input.photoUrl,
        notes: input.notes,
      });

      return { success: true };
    }),

  getVisits: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const allVisits = await db.select().from(visits);
    return allVisits;
  }),

  // EXPENSES MANAGEMENT
  createExpense: adminProcedure
    .input(ExpenseSchema)
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.insert(expenses).values({
        visitId: input.visitId,
        expenseType: input.expenseType,
        amount: input.amount,
        description: input.description,
        receiptUrl: input.receiptUrl,
        date: new Date(input.date),
      });

      return { success: true };
    }),

  getExpenses: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const allExpenses = await db.select().from(expenses);
    return allExpenses;
  }),

  // FINANCIAL CALCULATIONS
  calculateDietas: adminProcedure
    .input(z.object({ days: z.number(), dailyRate: z.number().optional() }))
    .query(({ input }) => {
      const dailyRate = input.dailyRate || 53.34; // RD 439/2007
      const total = input.days * dailyRate;
      return { days: input.days, dailyRate, total: total.toFixed(2) };
    }),

  calculateCesion: adminProcedure
    .input(z.object({ baseRent: z.number(), percentage: z.number().optional() }))
    .query(({ input }) => {
      const percentage = input.percentage || 45;
      const cesionAmount = (input.baseRent * percentage) / 100;
      return { baseRent: input.baseRent, percentage, cesionAmount: cesionAmount.toFixed(2) };
    }),

  // LEGAL COMPLIANCE
  getLegalCompliance: adminProcedure
    .input(z.object({ month: z.number(), year: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const compliance = await db
        .select()
        .from(legalCompliance)
        .where(and(eq(legalCompliance.month, input.month), eq(legalCompliance.year, input.year)))
        .limit(1);

      return compliance[0] || null;
    }),

  updateLegalCompliance: adminProcedure
    .input(
      z.object({
        month: z.number(),
        year: z.number(),
        actaConsejoRector: z.boolean().optional(),
        calendarioActividades: z.boolean().optional(),
        libroKilometraje: z.boolean().optional(),
        fotosTaller: z.boolean().optional(),
        anticipoSolicitado: z.boolean().optional(),
        anticipoAprobado: z.boolean().optional(),
        anticipoMonto: z.string().optional(),
        dietasRegistradas: z.number().optional(),
        alquilerBase: z.string().optional(),
        cesionMonto: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Calculate dietas total if days provided
      let dietasTotal = "0";
      if (input.dietasRegistradas) {
        dietasTotal = (input.dietasRegistradas * 53.34).toFixed(2);
      }

      // Calculate cesion if base rent provided
      let cesionMonto = input.cesionMonto;
      if (input.alquilerBase) {
        const baseRent = parseFloat(input.alquilerBase);
        cesionMonto = ((baseRent * 45) / 100).toFixed(2);
      }

      const existing = await db
        .select()
        .from(legalCompliance)
        .where(and(eq(legalCompliance.month, input.month), eq(legalCompliance.year, input.year)))
        .limit(1);

      if (existing.length > 0) {
        // Update
        await db
          .update(legalCompliance)
          .set({
            actaConsejoRector: input.actaConsejoRector,
            calendarioActividades: input.calendarioActividades,
            libroKilometraje: input.libroKilometraje,
            fotosTaller: input.fotosTaller,
            anticipoSolicitado: input.anticipoSolicitado,
            anticipoAprobado: input.anticipoAprobado,
            anticipoMonto: input.anticipoMonto,
            dietasRegistradas: input.dietasRegistradas,
            dietasTotal,
            alquilerBase: input.alquilerBase,
            cesionMonto,
            notes: input.notes,
          })
          .where(and(eq(legalCompliance.month, input.month), eq(legalCompliance.year, input.year)));
      } else {
        // Create
        await db.insert(legalCompliance).values({
          month: input.month,
          year: input.year,
          actaConsejoRector: input.actaConsejoRector || false,
          calendarioActividades: input.calendarioActividades || false,
          libroKilometraje: input.libroKilometraje || false,
          fotosTaller: input.fotosTaller || false,
          anticipoSolicitado: input.anticipoSolicitado || false,
          anticipoAprobado: input.anticipoAprobado || false,
          anticipoMonto: input.anticipoMonto,
          dietasRegistradas: input.dietasRegistradas || 0,
          dietasTotal,
          alquilerBase: input.alquilerBase,
          cesionMonto,
          notes: input.notes,
          status: "en_progreso",
        });
      }

      return { success: true };
    }),

  // QUOTATIONS
  createQuotation: adminProcedure
    .input(QuotationSchema)
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const engCost = parseFloat(input.engineeringCost || "0");
      const matCost = parseFloat(input.materialCost || "0");
      const postCost = parseFloat(input.postProcessingCost || "0");
      const totalCost = engCost + matCost + postCost;
      const margin = 30; // 30% default margin
      const finalPrice = totalCost * (1 + margin / 100);

      await db.insert(quotations).values({
        leadId: input.leadId,
        engineeringHours: input.engineeringHours,
        engineeringCost: input.engineeringCost,
        materialCost: input.materialCost,
        material: input.material,
        postProcessingHours: input.postProcessingHours,
        postProcessingCost: input.postProcessingCost,
        totalCost: totalCost.toString(),
        margin,
        finalPrice: finalPrice.toString(),
        description: input.description,
        status: "borrador",
      });

      return { success: true, finalPrice: finalPrice.toFixed(2) };
    }),

  getQuotations: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const allQuotations = await db.select().from(quotations);
    return allQuotations;
  }),
});
