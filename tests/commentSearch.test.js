import test from "node:test";
import assert from "node:assert/strict";
import { normalizeSearchText, searchComments } from "../src/utils/commentSearch.js";

const comments = [
  { text: "The background music is excellent", sentiment: "positive" },
  { text: "ఈ పాట చాలా బాగుంది", sentiment: "positive" },
  { text: "The explanation needs more detail", sentiment: "negative" },
];

test("search tolerates a simple spelling mistake", () => {
  const results = searchComments(comments, "excellant");
  assert.equal(results[0].text, comments[0].text);
});

test("search matches romanized Telugu to Telugu script", () => {
  const results = searchComments(comments, "bagundi");
  assert.equal(results[0].text, comments[1].text);
});

test("normalization removes accents and punctuation", () => {
  assert.equal(normalizeSearchText("  Bāgundi! "), "bagundi");
});
