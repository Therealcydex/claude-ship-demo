import { clampPage, hasNextPage, pageCount } from "./pagination";

describe("pageCount", () => {
  it("rounds partial pages up", () => {
    expect(pageCount(25, 10)).toBe(3);
  });

  it("counts exact multiples without an extra page", () => {
    expect(pageCount(100, 10)).toBe(10);
  });

  it("always reports at least one page", () => {
    expect(pageCount(0, 10)).toBe(1);
  });

  it("rejects a non-positive page size", () => {
    expect(() => pageCount(10, 0)).toThrow(RangeError);
  });
});

describe("clampPage", () => {
  it("keeps pages inside the valid range", () => {
    expect(clampPage(0, 100, 10)).toBe(1);
    expect(clampPage(4, 100, 10)).toBe(4);
    expect(clampPage(42, 100, 10)).toBe(10);
  });
});

describe("hasNextPage", () => {
  it("is true while more posts remain", () => {
    expect(hasNextPage(1, 10, 25)).toBe(true);
    expect(hasNextPage(2, 10, 25)).toBe(true);
  });

  it("is false on the last page", () => {
    expect(hasNextPage(3, 10, 25)).toBe(false);
  });
});
