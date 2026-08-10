import Fuse from "fuse.js";
import Sanscript from "@indic-transliteration/sanscript";

const INDIC_SCRIPTS = [
  ["telugu", /[\u0C00-\u0C7F]/u],
  ["devanagari", /[\u0900-\u097F]/u],
  ["kannada", /[\u0C80-\u0CFF]/u],
  ["malayalam", /[\u0D00-\u0D7F]/u],
  ["tamil", /[\u0B80-\u0BFF]/u],
  ["bengali", /[\u0980-\u09FF]/u],
  ["gujarati", /[\u0A80-\u0AFF]/u],
  ["gurmukhi", /[\u0A00-\u0A7F]/u],
  ["oriya", /[\u0B00-\u0B7F]/u],
  ["sinhala", /[\u0D80-\u0DFF]/u],
];

function romanizeIndicText(value) {
  return INDIC_SCRIPTS.reduce((text, [scheme, pattern]) => {
    if (!pattern.test(text)) return text;
    try {
      return Sanscript.t(text, scheme, "iast");
    } catch {
      return text;
    }
  }, value);
}

export function normalizeSearchText(value, { romanize = false } = {}) {
  const source = romanize ? romanizeIndicText(String(value || "")) : String(value || "");
  return source
    .normalize("NFKD")
    .replace(/\p{Mark}/gu, "")
    .toLocaleLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function createCommentSearch(comments) {
  const indexed = comments.map((comment, index) => ({
    comment,
    index,
    normalized: normalizeSearchText(comment.text),
    romanized: normalizeSearchText(comment.text, { romanize: true }),
  }));

  const fuzzyIndex = new Fuse(indexed, {
    keys: [
      { name: "romanized", weight: 0.65 },
      { name: "normalized", weight: 0.35 },
    ],
    threshold: 0.42,
    distance: 120,
    ignoreLocation: true,
    minMatchCharLength: 3,
    shouldSort: true,
  });

  return (query) => {
    const normalizedQuery = normalizeSearchText(query);
    const romanizedQuery = normalizeSearchText(query, { romanize: true });
    if (!normalizedQuery) return [];

    const exact = indexed.filter(
      (item) =>
        item.normalized.includes(normalizedQuery) ||
        item.romanized.includes(romanizedQuery),
    );
    if (normalizedQuery.length < 3) {
      return exact.map(({ comment }) => comment);
    }

    const exactIndexes = new Set(exact.map(({ index }) => index));
    const fuzzy = fuzzyIndex
      .search(romanizedQuery)
      .filter(({ item }) => !exactIndexes.has(item.index));

    return [
      ...exact.map(({ comment }) => comment),
      ...fuzzy.map(({ item }) => item.comment),
    ];
  };
}

export function searchComments(comments, query) {
  return createCommentSearch(comments)(query);
}
