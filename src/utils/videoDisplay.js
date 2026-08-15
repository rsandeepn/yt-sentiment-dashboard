import { contentId, platformLabel } from "./platforms.js";

export function videoDisplayName(source) {
  const title = source?.content_title ?? source?.content?.title ?? source?.video_title ?? source?.video?.title;
  if (typeof title === "string" && title.trim()) return title.trim();

  const id = contentId(source);
  const platform = platformLabel(source?.platform);
  if (platform === "Instagram") {
    return id ? `Instagram content ${id}` : "Instagram content";
  }
  return id ? `Video ${id}` : "YouTube video";
}
