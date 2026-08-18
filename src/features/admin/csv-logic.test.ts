import { describe, test, expect } from "vitest";
import { validateHeaders, extractValidRows } from "./csv-logic";

describe("Admin CSV Import Logic", () => {
  describe("validateHeaders", () => {
    test("returns valid and correct indices for standard headers", () => {
      const result = validateHeaders(["English Word", "Ukrainian Translation", "Difficulty"]);
      expect(result.isValid).toBe(true);
      expect(result.englishIdx).toBe(0);
      expect(result.ukrainianIdx).toBe(1);
    });

    test("is case-insensitive and ignores surrounding spaces", () => {
      const result = validateHeaders(["  eNgLiSh word ", " ukrainian translation "]);
      expect(result.isValid).toBe(true);
      expect(result.englishIdx).toBe(0);
      expect(result.ukrainianIdx).toBe(1);
    });

    test("returns invalid if required columns are missing", () => {
      const result = validateHeaders(["Word", "Translation"]);
      expect(result.isValid).toBe(false);
      expect(result.englishIdx).toBe(-1);
      expect(result.ukrainianIdx).toBe(-1);
    });

    test("handles empty or undefined headers safely", () => {
      const result = validateHeaders([]);
      expect(result.isValid).toBe(false);
    });
  });

  describe("extractValidRows", () => {
    test("extracts correct columns into ParsedRow objects based on indices", () => {
      const rows = [
        ["Apple", "Яблуко", "Easy"],
        ["Tree", "Дерево", "Easy"]
      ];
      // Expecting English at index 0, Ukrainian at index 1
      const result = extractValidRows(rows, 0, 1);
      
      expect(result).toHaveLength(2);
      expect(result[0].englishWord).toBe("Apple");
      expect(result[0].ukrainianTranslation).toBe("Яблуко");
    });

    test("ignores rows that do not have enough columns", () => {
      const rows = [
        ["Apple", "Яблуко"], 
        ["Tree"] // Too short, missing the second column
      ];
      const result = extractValidRows(rows, 0, 1);
      
      expect(result).toHaveLength(1);
      expect(result[0].englishWord).toBe("Apple");
    });
  });
});