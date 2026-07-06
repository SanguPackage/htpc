import { expect, test, describe } from "bun:test";
import { isTap, contentFor, formatStars, focusBox, zoomPanForBox } from "../assets/js/blueprint.js";

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

describe("focusBox", () => {
  test("null when there are no centers to frame", () => {
    expect(focusBox([], 50, 2)).toBeNull();
  });
  test("a single center yields a padded box grown to the viewport aspect, center kept", () => {
    // pad -> 100x100 box; aspect 2 widens it to 200x100 without moving the center.
    const b = focusBox([{ cx: 100, cy: 100 }], 50, 2);
    expect(b).toEqual({ x: 0, y: 50, w: 200, h: 100 });
    expect(b.x + b.w / 2).toBe(100);
    expect(b.y + b.h / 2).toBe(100);
  });
  test("frames the bounding box of several centers", () => {
    // spread 0..200 in x, 0..100 in y; pad 0; aspect 1 grows height to 200.
    const b = focusBox([{ cx: 0, cy: 0 }, { cx: 200, cy: 100 }], 0, 1);
    expect(b).toEqual({ x: 0, y: -50, w: 200, h: 200 });
  });
});

describe("zoomPanForBox", () => {
  test("frames a box centered in the viewport", () => {
    const r = zoomPanForBox({ x: 0, y: 0, w: 200, h: 100 }, { width: 400, height: 200 }, 1);
    expect(r).toEqual({ zoom: 2, panX: 0, panY: 0 });
  });
  test("clamps zoom so a tiny box does not over-zoom", () => {
    const r = zoomPanForBox({ x: 0, y: 0, w: 10, h: 10 }, { width: 400, height: 200 }, 1, 12);
    expect(r.zoom).toBe(12);
  });
});
