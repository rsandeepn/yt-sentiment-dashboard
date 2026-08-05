import assert from "node:assert/strict";
import test from "node:test";
import { deriveInsights, reportFilename } from "../src/utils/reportInsights.js";

test("derives percentages for analyses saved before insights existed", () => {
  const insights = deriveInsights({
    stats: { total: 10, positive: 6, negative: 3, neutral: 1, suggestions: 2 },
  });
  assert.equal(insights.dominant_sentiment, "positive");
  assert.equal(insights.positive_percentage, 60);
  assert.equal(insights.suggestion_percentage, 20);
  assert.equal(insights.average_sentiment_score, null);
});

test("uses enriched insights and video id for report names", () => {
  const enriched = { dominant_sentiment: "negative" };
  const result = { video: { id: "abc123" }, insights: enriched };
  assert.equal(deriveInsights(result), enriched);
  assert.equal(reportFilename(result, "pdf"), "abc123-comment-report.pdf");
});
