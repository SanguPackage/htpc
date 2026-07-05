import { expect, test, describe } from "bun:test";
import { shouldZoom } from "../assets/js/image-zoom.js";

describe("shouldZoom", () => {
  test("true when the natural image is meaningfully wider than displayed", () => {
    expect(shouldZoom(1200, 500)).toBe(true);
  });

  test("false when displayed at natural size", () => {
    expect(shouldZoom(500, 500)).toBe(false);
  });

  test("false for a sub-pixel/rounding difference within the threshold", () => {
    expect(shouldZoom(504, 500)).toBe(false);
  });

  test("true once past the threshold", () => {
    expect(shouldZoom(520, 500)).toBe(true);
  });

  test("false when width is unknown (image not loaded yet)", () => {
    expect(shouldZoom(0, 500)).toBe(false);
  });
});
