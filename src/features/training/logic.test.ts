import { describe, test, expect } from "vitest";
import { checkAnswer, calculateAccuracy } from "./logic";

describe("Training Logic", () => {
  describe("checkAnswer", () => {
    test("returns true for an exact match", () => {
      expect(checkAnswer("Яблуко", "Яблуко")).toBe(true);
    });

    test("returns true regardless of case and trailing spaces", () => {
      expect(checkAnswer(" яблуко ", "Яблуко")).toBe(true);
    });

    test("returns false for an incorrect answer", () => {
      expect(checkAnswer("Дерево", "Яблуко")).toBe(false);
    });
  });

  describe("calculateAccuracy", () => {
    test("calculates the correct percentage", () => {
      expect(calculateAccuracy(4, 5)).toBe(80);
      expect(calculateAccuracy(1, 3)).toBe(33);
      expect(calculateAccuracy(5, 5)).toBe(100);
    });

    test("returns 0 when total count is 0 to prevent division by zero", () => {
      expect(calculateAccuracy(0, 0)).toBe(0);
    });
  });
});