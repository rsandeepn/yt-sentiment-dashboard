const FILLER_WORDS = new Set([
  "a", "about", "after", "again", "all", "am", "an", "and", "any", "are",
  "as", "at", "be", "because", "been", "before", "being", "both", "but",
  "by", "can", "could", "did", "do", "does", "doing", "each", "for",
  "from", "had", "has", "have", "he", "her", "hers", "him", "his", "how",
  "i", "if", "in", "into", "is", "it", "its", "just", "me", "more",
  "most", "my", "no", "not", "now", "of", "on", "only", "or", "other",
  "our", "ours", "she", "should", "so", "some", "than", "that", "the",
  "their", "theirs", "them", "then", "there", "these", "they", "this",
  "those", "to", "too", "up", "very", "was", "we", "were", "what",
  "when", "where", "which", "who", "why", "will", "with", "would", "you",
  "your", "yours",
]);

export function filterMeaningfulKeywords(keywords) {
  return (keywords || []).filter(({ keyword }) => {
    const normalized = String(keyword || "").trim().toLocaleLowerCase();
    return normalized.length > 2 && !FILLER_WORDS.has(normalized);
  });
}
