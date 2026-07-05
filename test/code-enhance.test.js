import { expect, test, describe } from "bun:test";
import { parseLineSpec, splitHighlightedLines, renderLines } from "../assets/js/code-enhance.js";

describe("parseLineSpec", () => {
  test("single line number", () => {
    expect([...parseLineSpec("2")]).toEqual([2]);
  });

  test("comma list plus a range expands the range inclusively", () => {
    expect([...parseLineSpec("2,4-6")].sort((a, b) => a - b)).toEqual([2, 4, 5, 6]);
  });

  test("tolerates whitespace around numbers and dashes", () => {
    expect([...parseLineSpec(" 1, 3 - 4 ")].sort((a, b) => a - b)).toEqual([1, 3, 4]);
  });

  test("empty or missing spec yields no lines", () => {
    expect(parseLineSpec("").size).toBe(0);
    expect(parseLineSpec(null).size).toBe(0);
    expect(parseLineSpec(undefined).size).toBe(0);
  });
});

describe("splitHighlightedLines", () => {
  test("splits plain text on newlines", () => {
    expect(splitHighlightedLines("a\nb\nc")).toEqual(["a", "b", "c"]);
  });

  test("a single trailing newline does not create a blank last line", () => {
    expect(splitHighlightedLines("a\nb\n")).toEqual(["a", "b"]);
  });

  test("keeps an intentional interior blank line", () => {
    expect(splitHighlightedLines("a\n\nb")).toEqual(["a", "", "b"]);
  });

  test("reopens a span that straddles a newline", () => {
    expect(splitHighlightedLines('<span class="c">a\nb</span>c')).toEqual([
      '<span class="c">a</span>',
      '<span class="c">b</span>c',
    ]);
  });

  test("reopens nested spans across a newline", () => {
    expect(
      splitHighlightedLines('<span class="a"><span class="b">x\ny</span>z</span>')
    ).toEqual([
      '<span class="a"><span class="b">x</span></span>',
      '<span class="a"><span class="b">y</span>z</span>',
    ]);
  });
});

describe("renderLines", () => {
  // No separator between the block spans: a newline text node inside a <pre>
  // would render as an extra blank line between every code line.
  test("wraps each line in a .cl block with no separator between them", () => {
    expect(renderLines(["a", "b"], new Set())).toBe(
      '<span class="cl">a</span><span class="cl">b</span>'
    );
  });

  test("adds the hl class only to marked (1-based) lines", () => {
    expect(renderLines(["a", "b", "c"], new Set([2]))).toBe(
      '<span class="cl">a</span><span class="cl hl">b</span><span class="cl">c</span>'
    );
  });

  test("keeps a blank source line as an empty span", () => {
    expect(renderLines(["a", "", "b"], new Set())).toBe(
      '<span class="cl">a</span><span class="cl"></span><span class="cl">b</span>'
    );
  });
});
