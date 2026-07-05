import { expect, test, describe } from "bun:test";
import { isTap, contentFor, formatStars } from "../assets/js/blueprint.js";

describe("isTap", () => {
  test("true for a still, quick pointer gesture", () => {
    expect(isTap({ x: 100, y: 100, t: 0 }, { x: 103, y: 102, t: 120 })).toBe(true);
  });
  test("false when the pointer moved too far (a pan/drag)", () => {
    expect(isTap({ x: 100, y: 100, t: 0 }, { x: 140, y: 100, t: 120 })).toBe(false);
  });
  test("false when the gesture was too slow (a long press/drag)", () => {
    expect(isTap({ x: 100, y: 100, t: 0 }, { x: 101, y: 101, t: 900 })).toBe(false);
  });
  test("false when there was no pointerdown", () => {
    expect(isTap(null, { x: 100, y: 100, t: 10 })).toBe(false);
  });
});

describe("contentFor", () => {
  const data = { Radarr: { title: "Radarr" } };
  test("returns the entry for a known node id", () => {
    expect(contentFor("Radarr", data)).toEqual({ title: "Radarr" });
  });
  test("returns null for a node with no entry", () => {
    expect(contentFor("Torrents", data)).toBeNull();
  });
  test("returns null for a missing id", () => {
    expect(contentFor(undefined, data)).toBeNull();
  });
});

describe("formatStars", () => {
  test("small counts print verbatim", () => {
    expect(formatStars(999)).toBe("999");
    expect(formatStars(0)).toBe("0");
  });
  test("thousands get one decimal and a k", () => {
    expect(formatStars(13904)).toBe("13.9k");
    expect(formatStars(2380)).toBe("2.4k");
  });
  test("large round thousands drop the decimal", () => {
    expect(formatStars(53969)).toBe("54k");
  });
  test("empty string for unknown/nullish counts", () => {
    expect(formatStars(null)).toBe("");
    expect(formatStars(undefined)).toBe("");
  });
});
