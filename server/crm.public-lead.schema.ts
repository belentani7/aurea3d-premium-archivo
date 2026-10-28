import { z } from "zod";

/**
 * Anonymous CRM submissions are deliberately bounded to protect the public
 * endpoint and the varchar(20) phone column. Admin lifecycle updates use a
 * separate authenticated procedure.
 */
export const PublicLeadSchema = z.object({
  companyName: z.string().trim().min(1).max(200),
  contactName: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().max(20).optional(),
  sector: z.enum(["industrial", "nautica", "arquitectura", "otro"]),
  polygon: z.string().trim().max(200).optional(),
  notes: z.string().trim().max(4000).optional(),
}).strict();
