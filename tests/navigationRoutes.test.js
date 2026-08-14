import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const appSource = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const routePaths = new Set(
  [...appSource.matchAll(/<Route\s+path="([^"]+)"/g)].map((match) => match[1]),
);

const navigationFiles = [
  "../src/auth/Login.jsx",
  "../src/auth/Register.jsx",
  "../src/auth/ForgotPassword.jsx",
  "../src/auth/ResetPassword.jsx",
  "../src/auth/ProtectedRoute.jsx",
  "../src/components/ClustersPage.jsx",
  "../src/components/Dashboard.jsx",
  "../src/components/HistoryPage.jsx",
  "../src/components/SuggestionsPage.jsx",
  "../src/components/ThemePage.jsx",
  "../src/components/sample.jsx",
  "../src/layout/AppLayout.jsx",
  "../src/pages/LandingPage.jsx",
  "../src/pages/Login.jsx",
];

const targetPatterns = [
  /\b(?:navigate|go)\(\s*["'](\/[^"']*)["']/g,
  /\bto=["'](\/[^"']*)["']/g,
  /window\.location\.href\s*=\s*["'](\/[^"']*)["']/g,
];

test("all static navigation targets resolve to an application route", () => {
  for (const relativePath of navigationFiles) {
    const source = readFileSync(new URL(relativePath, import.meta.url), "utf8");
    for (const pattern of targetPatterns) {
      for (const match of source.matchAll(pattern)) {
        assert.ok(
          routePaths.has(match[1]),
          `${relativePath} points to undefined route ${match[1]}`,
        );
      }
    }
  }
});

test("authenticated report pages return to the protected analyzer", () => {
  const protectedPages = [
    "../src/components/ClustersPage.jsx",
    "../src/components/HistoryPage.jsx",
    "../src/components/SuggestionsPage.jsx",
    "../src/components/ThemePage.jsx",
    "../src/layout/AppLayout.jsx",
  ];

  for (const relativePath of protectedPages) {
    const source = readFileSync(new URL(relativePath, import.meta.url), "utf8");
    assert.doesNotMatch(
      source,
      /\b(?:navigate|go)\(\s*["']\/["']\s*\)/,
      `${relativePath} must not send authenticated users to the public landing page`,
    );
  }
});

test("unknown URLs have a safe fallback route", () => {
  assert.match(appSource, /<Route path="\*" element=\{<Navigate to="\/" replace \/>\} \/>/);
});
