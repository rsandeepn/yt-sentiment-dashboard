export function parseSummary(summaryText) {
  if (!summaryText) return {};

  const sections = {};
  let current = null;
  let buffer = [];

  const commit = () => {
    if (current) sections[current] = buffer.join("\n").trim();
    buffer = [];
  };

  const lines = summaryText.split("\n");

  for (let line of lines) {
    const trimmed = line.trim();

    /** MATCH HEADERS */
    if (trimmed.startsWith("### 🧠")) {
      commit();
      current = "highLevel";
    } else if (trimmed.startsWith("### ⭐")) {
      commit();
      current = "positives";
    } else if (trimmed.startsWith("### ⚠️")) {
      commit();
      current = "negatives";
    } else if (trimmed.startsWith("### 😐")) {
      commit();
      current = "neutral";
    } else if (trimmed.startsWith("### 💡")) {
      commit();
      current = "suggestions"; // ✅ FIXED correct name
    } else {
      buffer.push(line);
    }
  }

  commit();
  return sections;
}
