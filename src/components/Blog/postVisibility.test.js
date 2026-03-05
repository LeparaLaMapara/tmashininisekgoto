import { getPublishedPosts, isPostPublished } from "./postVisibility";

describe("post visibility", () => {
  const fixedNow = new Date("2026-01-01T00:00:00.000Z");

  test("treats posts without a date as published", () => {
    expect(isPostPublished(undefined, fixedNow)).toBe(true);
  });

  test("hides posts with future publish dates", () => {
    expect(isPostPublished("2026-02-01", fixedNow)).toBe(false);
    expect(isPostPublished("2025-12-31", fixedNow)).toBe(true);
  });

  test("filters out unpublished posts from a list", () => {
    const posts = [
      { id: "past", date: "2025-12-01" },
      { id: "today", date: "2026-01-01" },
      { id: "future", date: "2026-01-02" },
    ];

    expect(getPublishedPosts(posts, fixedNow).map((post) => post.id)).toEqual(["past", "today"]);
  });
});
