import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import express from "express";
import { configureBodyParsers } from "../server/_core/bodyParsers.ts";

const app = express();
configureBodyParsers(app);
app.post("/api/trpc/crm.createLead", (req, res) => res.json({ received: req.body?.notes?.length ?? 0 }));
app.post("/api/trpc/crm.createLead,crm.getLeads", (req, res) => res.json({ received: req.body?.notes?.length ?? 0 }));
app.post("/api/upload", (req, res) => res.json({ received: req.body?.notes?.length ?? 0 }));

let server;
let origin;
before(async () => {
  server = await new Promise((resolve) => {
    const listening = app.listen(0, "127.0.0.1", () => resolve(listening));
  });
  origin = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  if (server) await new Promise((resolve, reject) => server.close((err) => err ? reject(err) : resolve()));
});

async function submit(path, size) {
  return fetch(`${origin}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ notes: "x".repeat(size) }),
  });
}

test("small public tRPC JSON still reaches its handler", async () => {
  const response = await submit("/api/trpc/crm.createLead", 128);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { received: 128 });
});

test("oversized anonymous tRPC JSON is rejected before its handler", async () => {
  const response = await submit("/api/trpc/crm.createLead", 70_000);
  assert.equal(response.status, 413);
});

test("batched tRPC paths cannot bypass the smaller JSON limit", async () => {
  const response = await submit("/api/trpc/crm.createLead,crm.getLeads", 70_000);
  assert.equal(response.status, 413);
});

test("legacy non-tRPC routes keep their existing upload-sized limit", async () => {
  const response = await submit("/api/upload", 70_000);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { received: 70_000 });
});
