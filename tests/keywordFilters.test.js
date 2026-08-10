import test from "node:test";
import assert from "node:assert/strict";
import { filterMeaningfulKeywords } from "../src/utils/keywordFilters.js";

test("historical keyword results also hide pronouns and filler words", () => {
  const filtered = filterMeaningfulKeywords([
    { keyword: "they", count: 12 },
    { keyword: "after", count: 10 },
    { keyword: "music", count: 8 },
    { keyword: "excellent", count: 6 },
  ]);

  assert.deepEqual(filtered, [
    { keyword: "music", count: 8 },
    { keyword: "excellent", count: 6 },
  ]);
});
