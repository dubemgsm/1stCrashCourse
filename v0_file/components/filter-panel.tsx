"use client";

import { useMemo } from "react";
import type { DataPoint } from "@/lib/types";
import { Filter } from "lucide-react";

interface FilterPanelProps {
  data: DataPoint[];
  filters: {
    country: string;
    cause: string;
    minSeverity: number;
  };
  onFiltersChange: (filters: {
    country: string;
    cause: string;
    minSeverity: number;
  }) => void;
}

export function FilterPanel({
  data,
  filters,
  onFiltersChange,
}: FilterPanelProps) {
  const countries = useMemo(() => {
    const set = new Set(data.map((d) => d.Country));
    return Array.from(set).sort();
  }, [data]);

  const causes = useMemo(() => {
    const set = new Set(
      data.map((d) => d.categorised_cause || d.MainCause || "Unknown")
    );
    return Array.from(set).sort();
  }, [data]);

  return (
    <div className="bg-card rounded-lg p-4 border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-primary" />
        <h3 className="font-medium text-foreground">Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="country-filter"
            className="block text-sm text-muted-foreground mb-1.5"
          >
            Country
          </label>
          <select
            id="country-filter"
            value={filters.country}
            onChange={(e) =>
              onFiltersChange({ ...filters, country: e.target.value })
            }
            className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="cause-filter"
            className="block text-sm text-muted-foreground mb-1.5"
          >
            Cause
          </label>
          <select
            id="cause-filter"
            value={filters.cause}
            onChange={(e) =>
              onFiltersChange({ ...filters, cause: e.target.value })
            }
            className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Causes</option>
            {causes.map((cause) => (
              <option key={cause} value={cause}>
                {cause}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="severity-filter"
            className="block text-sm text-muted-foreground mb-1.5"
          >
            Min Severity: {filters.minSeverity}
          </label>
          <input
            id="severity-filter"
            type="range"
            min="0"
            max="3"
            step="0.5"
            value={filters.minSeverity}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                minSeverity: parseFloat(e.target.value),
              })
            }
            className="w-full accent-primary"
          />
        </div>
      </div>
    </div>
  );
}
