export function deriveInsights(result) {
  if (result?.insights) return result.insights;

  const stats = result?.stats || {};
  const total = Number(stats.total) || 0;
  const entries = ["positive", "negative", "neutral"];
  const dominant = entries.reduce(
    (best, label) => (Number(stats[label] || 0) > Number(stats[best] || 0) ? label : best),
    "neutral",
  );

  return {
    dominant_sentiment: dominant,
    positive_percentage: total ? Number(((stats.positive || 0) / total * 100).toFixed(1)) : 0,
    negative_percentage: total ? Number(((stats.negative || 0) / total * 100).toFixed(1)) : 0,
    neutral_percentage: total ? Number(((stats.neutral || 0) / total * 100).toFixed(1)) : 0,
    suggestion_percentage: total ? Number(((stats.suggestions || 0) / total * 100).toFixed(1)) : 0,
    average_sentiment_score: null,
    top_keywords: [],
    language_breakdown: [],
  };
}

export function reportFilename(result, extension) {
  const videoId = result?.video?.id || "youtube-analysis";
  return `${videoId}-comment-report.${extension}`;
}

export function downloadJSONReport(result) {
  const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = reportFilename(result, "json");
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}
