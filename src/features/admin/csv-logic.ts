export type ParsedRow = {
  englishWord: string;
  ukrainianTranslation: string;
};

// Validate headers and find column indices
export function validateHeaders(headers: string[] = []) {
  if (!headers || headers.length === 0) {
    return { isValid: false, englishIdx: -1, ukrainianIdx: -1 };
  }

  const normalized = headers.map((h) => h?.trim().toLowerCase() || "");
  const englishIdx = normalized.findIndex((h) => h.includes("english"));
  const ukrainianIdx = normalized.findIndex((h) => h.includes("ukrainian"));

  if (englishIdx === -1 || ukrainianIdx === -1) {
    return { isValid: false, englishIdx: -1, ukrainianIdx: -1 };
  }

  return { isValid: true, englishIdx, ukrainianIdx };
}

// Transform raw CSV rows into structured objects
export function extractValidRows(
  dataRows: string[][],
  englishIdx: number,
  ukrainianIdx: number
): ParsedRow[] {
  const parsedData: ParsedRow[] = [];

  for (let i = 0; i < dataRows.length; i++) {
    const columns = dataRows[i];

    if (columns && columns.length > Math.max(englishIdx, ukrainianIdx)) {
      parsedData.push({
        englishWord: columns[englishIdx]?.trim() || "",
        ukrainianTranslation: columns[ukrainianIdx]?.trim() || "",
      });
    }
  }

  return parsedData;
}