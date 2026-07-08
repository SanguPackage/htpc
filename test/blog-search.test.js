import { expect, test, describe } from "bun:test";
import { matches } from "../assets/js/blog-search.js";

describe("matches", () => {
  const hay = "jellyfin setup you need that transcoding jellyfin docker self-hosted media";

  test("empty or whitespace-only query matches everything", () => {
    expect(matches(hay, "")).toBe(true);
    expect(matches(hay, "   ")).toBe(true);
  });

  test("single term matches as a case-insensitive substring", () => {
    expect(matches(hay, "JELLY")).toBe(true);
    expect(matches("Radarr/Sonarr Lists", "sonarr")).toBe(true);
  });

  test("a term absent from the haystack does not match", () => {
    expect(matches(hay, "plex")).toBe(false);
  });

  test("every whitespace-separated term must be present (AND)", () => {
    expect(matches(hay, "jellyfin docker")).toBe(true);
    expect(matches(hay, "jellyfin plex")).toBe(false);
  });

  test("term order does not matter", () => {
    expect(matches(hay, "docker jellyfin")).toBe(true);
  });

  test("empty haystack matches only an empty query", () => {
    expect(matches("", "")).toBe(true);
    expect(matches("", "jellyfin")).toBe(false);
    expect(matches(null, "jellyfin")).toBe(false);
  });
});
