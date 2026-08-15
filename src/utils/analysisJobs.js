export const ACTIVE_ANALYSIS_STATUSES = ["queued", "running"];

export function isActiveAnalysis(job) {
  return Boolean(job && ACTIVE_ANALYSIS_STATUSES.includes(job.status));
}

export function historyQuery({ search = "", status = "all", platform = "all", page = 1, pageSize = 10 }) {
  return {
    search: search.trim(),
    status,
    platform,
    page,
    page_size: pageSize,
  };
}

export function analysisJobOutcome(job) {
  if (!job) return "idle";
  if (job.status === "completed") return "results";
  if (job.status === "failed") return "failed";
  return isActiveAnalysis(job) ? "poll" : "idle";
}
