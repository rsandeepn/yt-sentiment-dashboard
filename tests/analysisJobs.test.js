import assert from "node:assert/strict";
import test from "node:test";
import { analysisJobOutcome, historyQuery, isActiveAnalysis } from "../src/utils/analysisJobs.js";

test("queued and running jobs remain active", () => {
  assert.equal(isActiveAnalysis({ status: "queued" }), true);
  assert.equal(isActiveAnalysis({ status: "running" }), true);
  assert.equal(isActiveAnalysis({ status: "completed" }), false);
});

test("job outcomes drive polling, results, and failure UI", () => {
  assert.equal(analysisJobOutcome({ status: "running" }), "poll");
  assert.equal(analysisJobOutcome({ status: "completed" }), "results");
  assert.equal(analysisJobOutcome({ status: "failed" }), "failed");
});

test("history query trims search and preserves pagination", () => {
  assert.deepEqual(
    historyQuery({ search: "  abc123  ", status: "completed", page: 2, pageSize: 10 }),
    { search: "abc123", status: "completed", page: 2, page_size: 10 },
  );
});
