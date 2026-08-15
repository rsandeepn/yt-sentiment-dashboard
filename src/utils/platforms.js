const PLATFORM_LABELS = {
  youtube: "YouTube",
  instagram: "Instagram",
};

export function platformLabel(platform) {
  return PLATFORM_LABELS[platform] || PLATFORM_LABELS.youtube;
}

export function contentId(source) {
  return source?.content_id ?? source?.content?.id ?? source?.video_id ?? source?.video?.id ?? "";
}

export function contentUrl(source) {
  return source?.content_url ?? source?.content?.url ?? source?.video_url ?? source?.video?.url ?? "";
}
