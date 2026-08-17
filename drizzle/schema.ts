import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, date, json } from "drizzle-orm/mysql-core";

/**
 * ÁUREA 3D - Backend CRM Schema
 * Supervivencia Legal + Prospección B2B + Gestión Financiera
 */

// USERS (Autenticación)
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

// LEADS (CRM compatible con la tabla existente de la primera versión)
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  company: varchar("company", { length: 255 }),
  status: mysqlEnum("status", ["new", "contacted", "qualified", "converted", "lost"]).default("new").notNull(),
  source: varchar("source", { length: 100 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// VISITS (Registro de Visitas a Polígonos/Puertos)
export const visits = mysqlTable("visits", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId"),
  visitDate: date("visitDate").notNull(),
  location: varchar("location", { length: 255 }).notNull(), // Polígono o Puerto
  duration: int("duration"), // Minutos
  kilometers: decimal("kilometers", { precision: 8, scale: 2 }), // Distancia recorrida
  photoUrl: text("photoUrl"), // URL de foto adjunta
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// EXPENSES (Dietas y Gastos de Prospección)
export const expenses = mysqlTable("expenses", {
  id: int("id").autoincrement().primaryKey(),
  visitId: int("visitId"),
  expenseType: mysqlEnum("expenseType", ["dieta_instalacion", "dieta_prospección", "kilometraje", "material", "otro"]).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  receiptUrl: text("receiptUrl"), // Ticket/recibo adjunto
  date: date("date").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// LEGAL_COMPLIANCE (Checklist Legal del Mes)
export const legalCompliance = mysqlTable("legalCompliance", {
  id: int("id").autoincrement().primaryKey(),
  month: int("month").notNull(), // 1-12
  year: int("year").notNull(),
  
  // Checklist items
  actaConsejoRector: boolean("actaConsejoRector").default(false),
  calendarioActividades: boolean("calendarioActividades").default(false),
  libroKilometraje: boolean("libroKilometraje").default(false),
  fotosTaller: boolean("fotosTaller").default(false),
  
  // Anticipos (Art. 76 Ley Cooperativas)
  anticipoSolicitado: boolean("anticipoSolicitado").default(false),
  anticipoAprobado: boolean("anticipoAprobado").default(false),
  anticipoMonto: decimal("anticipoMonto", { precision: 10, scale: 2 }).default("0"),
  anticipoDevolucion: date("anticipoDevolucion"), // Fecha de devolución
  
  // Dietas (RD 439/2007)
  dietasRegistradas: int("dietasRegistradas").default(0), // Número de días
  dietasTotal: decimal("dietasTotal", { precision: 10, scale: 2 }).default("0"),
  
  // Cesión de Espacio (45% del alquiler)
  alquilerBase: decimal("alquilerBase", { precision: 10, scale: 2 }).default("0"),
  cesionPorcentaje: int("cesionPorcentaje").default(45),
  cesionMonto: decimal("cesionMonto", { precision: 10, scale: 2 }).default("0"),
  
  // Notas y estado
  notes: text("notes"),
  status: mysqlEnum("status", ["pendiente", "en_progreso", "completado", "auditado"]).default("pendiente").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// QUOTATIONS (Cotizaciones B2B)
export const quotations = mysqlTable("quotations", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  quotationNumber: varchar("quotationNumber", { length: 50 }).unique(),
  
  // Servicios
  engineeringHours: decimal("engineeringHours", { precision: 8, scale: 2 }).default("0"),
  engineeringCost: decimal("engineeringCost", { precision: 10, scale: 2 }).default("0"),
  
  materialCost: decimal("materialCost", { precision: 10, scale: 2 }).default("0"),
  material: varchar("material", { length: 100 }), // PA12, PETG, ASA, etc.
  
  postProcessingHours: decimal("postProcessingHours", { precision: 8, scale: 2 }).default("0"),
  postProcessingCost: decimal("postProcessingCost", { precision: 10, scale: 2 }).default("0"),
  
  totalCost: decimal("totalCost", { precision: 10, scale: 2 }).default("0"),
  margin: int("margin").default(30), // Porcentaje de margen
  finalPrice: decimal("finalPrice", { precision: 10, scale: 2 }).default("0"),
  
  description: text("description"),
  status: mysqlEnum("status", ["borrador", "enviada", "aceptada", "rechazada"]).default("borrador").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

export type Visit = typeof visits.$inferSelect;
export type InsertVisit = typeof visits.$inferInsert;

export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = typeof expenses.$inferInsert;

export type LegalCompliance = typeof legalCompliance.$inferSelect;
export type InsertLegalCompliance = typeof legalCompliance.$inferInsert;

export type Quotation = typeof quotations.$inferSelect;
export type InsertQuotation = typeof quotations.$inferInsert;

// AUTOMATIONS (Workflows gestionables desde AutomationPanel)
export const automations = mysqlTable("automations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  trigger: varchar("trigger", { length: 100 }).notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Automation = typeof automations.$inferSelect;
export type InsertAutomation = typeof automations.$inferInsert;

// PORTFOLIO PROJECTS (Galería pública administrable)
export const portfolioProjects = mysqlTable("portfolioProjects", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("imageUrl"),
  category: varchar("category", { length: 100 }),
  link: varchar("link", { length: 500 }),
  featured: int("featured").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PortfolioProject = typeof portfolioProjects.$inferSelect;
export type InsertPortfolioProject = typeof portfolioProjects.$inferInsert;
