import { expect, test, describe } from "bun:test";
import { isTap, contentFor } from "../assets/js/blueprint.js";

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
