export interface DataPoint {
  ID?: string | number;
  GlideNumber?: string | number;
  Country: string;
  multi_country?: string;
  long: number;
  lat: number;
  Area?: number;
  Began?: number | string;
  Ended?: number | string;
  Validation?: string;
  Dead?: number;
  Displaced?: number;
  MainCause?: string;
  Severity: number;
  categorised_cause?: string;
  [key: string]: string | number | undefined;
}

export interface DataStats {
  totalEvents: number;
  totalDeaths: number;
  totalDisplaced: number;
  countriesAffected: number;
  avgSeverity: number;
  causeBreakdown: Record<string, number>;
}
