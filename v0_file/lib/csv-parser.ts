import type { DataPoint } from "./types";

export function parseCSV(text: string): DataPoint[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  // Try different delimiters
  const delimiters = ["\t", ",", ";"];
  let delimiter = ",";
  let maxColumns = 0;

  for (const d of delimiters) {
    const columns = lines[0].split(d).length;
    if (columns > maxColumns) {
      maxColumns = columns;
      delimiter = d;
    }
  }

  const headers = lines[0].split(delimiter).map((h) => h.trim().replace(/^"|"$/g, ""));
  const data: DataPoint[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const values = parseCSVLine(line, delimiter);
    const row: Record<string, string | number | undefined> = {};

    headers.forEach((header, index) => {
      const value = values[index]?.trim().replace(/^"|"$/g, "") || "";
      
      // Try to parse as number
      const num = parseFloat(value);
      if (!isNaN(num) && value !== "") {
        row[header] = num;
      } else {
        row[header] = value;
      }
    });

    // Normalize field names (handle different casing)
    const normalized: DataPoint = {
      Country: String(row.Country || row.country || "Unknown"),
      long: Number(row.long || row.Long || row.longitude || row.Longitude || row.lng || row.Lng || 0),
      lat: Number(row.lat || row.Lat || row.latitude || row.Latitude || 0),
      Severity: Number(row.Severity || row.severity || 1),
      ID: row.ID || row.id,
      GlideNumber: row.GlideNumber || row.glideNumber,
      multi_country: String(row.multi_country || row.Multi_country || ""),
      Area: Number(row.Area || row.area || 0),
      Began: row.Began || row.began,
      Ended: row.Ended || row.ended,
      Validation: String(row.Validation || row.validation || ""),
      Dead: Number(row.Dead || row.dead || row.Deaths || row.deaths || 0),
      Displaced: Number(row.Displaced || row.displaced || 0),
      MainCause: String(row.MainCause || row.mainCause || row.Cause || row.cause || ""),
      categorised_cause: String(row.categorised_cause || row.CategorisedCause || ""),
    };

    // Only add if we have valid coordinates
    if (!isNaN(normalized.lat) && !isNaN(normalized.long)) {
      data.push(normalized);
    }
  }

  return data;
}

function parseCSVLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

export function calculateStats(data: DataPoint[]) {
  if (data.length === 0) {
    return {
      totalEvents: 0,
      totalDeaths: 0,
      totalDisplaced: 0,
      countriesAffected: 0,
      avgSeverity: 0,
      causeBreakdown: {},
    };
  }

  const countries = new Set(data.map((d) => d.Country));
  const causes: Record<string, number> = {};

  data.forEach((d) => {
    const cause = d.categorised_cause || d.MainCause || "Unknown";
    causes[cause] = (causes[cause] || 0) + 1;
  });

  return {
    totalEvents: data.length,
    totalDeaths: data.reduce((sum, d) => sum + (d.Dead || 0), 0),
    totalDisplaced: data.reduce((sum, d) => sum + (d.Displaced || 0), 0),
    countriesAffected: countries.size,
    avgSeverity: data.reduce((sum, d) => sum + (d.Severity || 0), 0) / data.length,
    causeBreakdown: causes,
  };
}
