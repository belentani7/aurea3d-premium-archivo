import express from "express";
import type { Express } from "express";

/**
 * Public tRPC requests contain structured JSON, never binary uploads.
 * Parse them with a smaller limit before the legacy upload-sized parser.
 * This also covers batched tRPC URLs under /api/trpc.
 */
export function configureBodyParsers(app: Express): void {
  app.use("/api/trpc", express.json({ limit: "64kb" }));
  // Preserve existing limits for other routes, including storage uploads.
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
}
