/** The public contact form may create a prospect, never set its CRM lifecycle. */
export type PublicLeadInput = {
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  sector: "industrial" | "nautica" | "arquitectura" | "otro";
  polygon?: string;
  notes?: string;
};

export function buildPublicLeadRecord(input: PublicLeadInput) {
  return {
    name: input.contactName,
    email: input.email,
    phone: input.phone,
    company: input.companyName,
    source: input.sector,
    status: "new" as const,
    notes: input.polygon
      ? `Polígono/puerto: ${input.polygon}\n${input.notes || ""}`
      : input.notes,
  };
}
