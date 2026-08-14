export function videoDisplayName(source) {
  const title = source?.video_title ?? source?.video?.title;
  if (typeof title === "string" && title.trim()) return title.trim();

  const videoId = source?.video_id ?? source?.video?.id;
  return videoId ? `Video ${videoId}` : "YouTube video";
}
