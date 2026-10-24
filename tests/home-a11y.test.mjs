import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const source = readFileSync(
  new URL("../client/src/pages/HomeSupremePremium.tsx", import.meta.url),
  "utf8",
);

// Source-contract regression checks. Browser/assistive-technology testing is still required.
test("hero has a semantic heading and bilingual document language", () => {
  assert.match(source, /<h1 className="ht sy"/);
  assert.match(source, /<\/h1>/);
  assert.match(source, /<div className="ar" ref={rootRef} lang={lang}>/);
});

test("contact form fields have accessible names", () => {
  for (const field of ["company", "contact", "email", "phone", "sector", "desc"]) {
    assert.match(source, new RegExp('aria-label=\\{i\\.form\\.' + field + '\\}'));
  }
});

test("form has appropriate input types and autocomplete", () => {
  assert.match(source, /type="email" aria-label={i\.form\.email} autoComplete="email"/);
  assert.match(source, /type="tel" aria-label={i\.form\.phone} autoComplete="tel"/);
  assert.match(source, /autoComplete="organization"/);
  assert.match(source, /autoComplete="name"/);
});

test("small screens use a one-column form layout", () => {
  assert.equal((source.match(/className="ar-form-grid"/g) ?? []).length, 2);
  assert.match(source, /\.ar \.ar-form-grid\{grid-template-columns:1fr!important\}/);
});

test("reduced-motion preference prevents GSAP setup and keeps content visible", () => {
  assert.match(source, /matchMedia\("\(prefers-reduced-motion: reduce\)"\)\.matches\) return/);
  assert.match(source, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(source, /\.ro\{opacity:1;transform:none\}/);
});

test("focus and failure feedback remain visible and localized", () => {
  assert.match(source, /\.ar :focus-visible\{outline:2px solid var\(--g\)/);
  assert.match(source, /toast\.error\(lang === "es"/);
  assert.match(source, /aria-label={lang === "es" \? "Switch to English" : "Cambiar a español"}/);
});
