import assert from "node:assert/strict";
import test from "node:test";
import { contentId, contentUrl, platformLabel } from "../src/utils/platforms.js";

test("uses platform-neutral content fields", () => {
  const source = {
    platform: "instagram",
    content_id: "C123example",
    content_url: "https://www.instagram.com/reel/C123example/",
  };

  assert.equal(platformLabel(source.platform), "Instagram");
  assert.equal(contentId(source), "C123example");
  assert.equal(contentUrl(source), source.content_url);
});

test("keeps compatibility with existing YouTube history", () => {
  const source = {
    video_id: "bMoQA-IFhks",
    video_url: "https://www.youtube.com/watch?v=bMoQA-IFhks",
  };

  assert.equal(platformLabel(source.platform), "YouTube");
  assert.equal(contentId(source), "bMoQA-IFhks");
  assert.equal(contentUrl(source), source.video_url);
});
