import { afterEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { appRouter } from "./routers";
import { getDb } from "./db";
import { portfolioProjects } from "../drizzle/schema";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;
const projectTitle = "QA Portfolio Project";

function context(role: "admin" | "user"): TrpcContext {
  const user: AuthenticatedUser = {
    id: role === "admin" ? 1 : 2,
    openId: `${role}-portfolio-test`,
    email: `${role}-portfolio@example.com`,
    name: `${role} portfolio test`,
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
  if (db) await db.delete(portfolioProjects).where(eq(portfolioProjects.title, projectTitle));
});

describe("portfolio project flow", () => {
  it("creates, lists, edits and deletes an admin project", async () => {
    const admin = appRouter.createCaller(context("admin"));
    const publicCaller = appRouter.createCaller({ ...context("user"), user: null });

    const created = await admin.portfolio.create({
      title: projectTitle,
      description: "QA project",
      imageUrl: "/manus-storage/industrial-precision_8d8efd4f.svg",
      category: "technical",
      featured: 1,
    });
    expect(created?.title).toBe(projectTitle);

    const publicList = await publicCaller.portfolio.list();
    expect(publicList.some((project) => project.id === created!.id)).toBe(true);

    const updated = await admin.portfolio.update({ id: created!.id, title: `${projectTitle} Updated`, featured: 0 });
    expect(updated?.title).toBe(`${projectTitle} Updated`);
    expect(updated?.featured).toBe(0);

    await admin.portfolio.delete({ id: created!.id });
    const afterDelete = await publicCaller.portfolio.list();
    expect(afterDelete.some((project) => project.id === created!.id)).toBe(false);
  });

  it("rejects portfolio mutations for non-admin users", async () => {
    const user = appRouter.createCaller(context("user"));
    await expect(user.portfolio.create({ title: projectTitle, category: "technical" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
