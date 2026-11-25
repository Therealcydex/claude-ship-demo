import { resultSummary } from "./text";

describe("resultSummary", () => {
  it("uses the singular for one result", () => {
    expect(resultSummary(1, "qui")).toBe('1 result for "Qui"');
  });

  it("trims and capitalizes the query", () => {
    expect(resultSummary(3, "  dolor sit ")).toBe('3 results for "Dolor sit"');
  });
});
