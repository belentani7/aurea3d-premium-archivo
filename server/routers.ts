import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { crmRouter } from "./crm.router";
import {
  createLead,
  getLeads,
  createAutomation,
  deleteAutomation,
  getAutomations,
  updateAutomation,
  createPortfolioProject,
  deletePortfolioProject,
  getPortfolioProjects,
  updatePortfolioProject,
} from "./db";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next();
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Backward-compatible leads contract used by the original CRM surface
  leads: router({
    create: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        company: z.string().optional(),
        phone: z.string().optional(),
        pieceType: z.string().optional(),
        material: z.string().optional(),
        quantity: z.number().optional(),
        endUse: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(({ input }) => createLead({
        name: input.name,
        email: input.email,
        company: input.company,
        phone: input.phone,
        source: input.pieceType,
        notes: [
          input.material ? `Material: ${input.material}` : "",
          input.quantity ? `Cantidad: ${input.quantity}` : "",
          input.endUse ? `Uso final: ${input.endUse}` : "",
          input.notes ?? "",
        ].filter(Boolean).join("\\n") || undefined,
      })),
    list: adminProcedure
      .input(z.object({ status: z.string().optional(), limit: z.number().optional(), offset: z.number().optional() }).optional())
      .query(({ input }) => getLeads(input)),
  }),

  // CRM Module - Prospección, Dietas, Anticipos, Cesión de Espacio
  crm: crmRouter,

  // AutomationPanel - workflows reales persistidos en base de datos
  automations: router({
    list: adminProcedure.query(() => getAutomations()),
    create: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        trigger: z.string().min(1),
        action: z.string().min(1),
      }))
      .mutation(({ input }) => createAutomation({ ...input, isActive: 1 })),
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        trigger: z.string().optional(),
        action: z.string().optional(),
        isActive: z.number().int().min(0).max(1).optional(),
      }))
      .mutation(({ input }) => {
        const { id, ...changes } = input;
        return updateAutomation(id, changes);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteAutomation(input.id).then(() => ({ success: true }))),
  }),

  // Portfolio público y gestión privada
  portfolio: router({
    list: publicProcedure.query(() => getPortfolioProjects()),
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        imageUrl: z.string().refine((value) => value.startsWith("/manus-storage/") || value.startsWith("https://") || value.startsWith("http://"), "URL o ruta de storage válida requerida").optional(),
        category: z.string().optional(),
        link: z.string().url().optional(),
        featured: z.number().int().min(0).max(1).optional(),
      }))
      .mutation(({ input }) => createPortfolioProject({ ...input, featured: input.featured ?? 0 })),
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().refine((value) => value.startsWith("/manus-storage/") || value.startsWith("https://") || value.startsWith("http://"), "URL o ruta de storage válida requerida").optional(),
        category: z.string().optional(),
        link: z.string().url().optional(),
        featured: z.number().int().min(0).max(1).optional(),
      }))
      .mutation(({ input }) => {
        const { id, ...changes } = input;
        return updatePortfolioProject(id, changes);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deletePortfolioProject(input.id).then(() => ({ success: true }))),
  }),
});

export type AppRouter = typeof appRouter;
