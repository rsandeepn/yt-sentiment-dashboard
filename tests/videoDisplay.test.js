import assert from "node:assert/strict";
import test from "node:test";
import { videoDisplayName } from "../src/utils/videoDisplay.js";

test("uses a saved history title instead of the video id", () => {
  assert.equal(
    videoDisplayName({
      video_id: "bMoQA-IFhks",
      video_title: "Filmymoji Middle Class Madhu Kotha AC MCM",
    }),
    "Filmymoji Middle Class Madhu Kotha AC MCM",
  );
});

test("uses the current analysis title", () => {
  assert.equal(
    videoDisplayName({ video: { id: "bMoQA-IFhks", title: "Filmymoji" } }),
    "Filmymoji",
  );
});

test("falls back to the video id for older reports", () => {
  assert.equal(videoDisplayName({ video_id: "bMoQA-IFhks" }), "Video bMoQA-IFhks");
});

test("uses platform-neutral Instagram content fields", () => {
  assert.equal(
    videoDisplayName({
      platform: "instagram",
      content_id: "C123example",
      content_title: "New product Reel",
    }),
    "New product Reel",
  );
});

test("labels Instagram content when a title is unavailable", () => {
  assert.equal(
    videoDisplayName({ platform: "instagram", content_id: "C123example" }),
    "Instagram content C123example",
  );
});
