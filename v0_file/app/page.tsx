"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { FileDropzone } from "@/components/file-dropzone";
import { StatsPanel } from "@/components/stats-panel";
import { DataTable } from "@/components/data-table";
import { FilterPanel } from "@/components/filter-panel";
import { SeverityLegend } from "@/components/severity-legend";
import { parseCSV, calculateStats } from "@/lib/csv-parser";
import type { DataPoint } from "@/lib/types";
import { Map, Table, BarChart3 } from "lucide-react";

// Dynamically import map to avoid SSR issues with Leaflet
const MapView = dynamic(
  () => import("@/components/map-view").then((mod) => mod.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-card rounded-lg">
        <div className="text-muted-foreground">Loading map...</div>
      </div>
    ),
  }
);

type ViewMode = "map" | "table" | "split";

export default function HomePage() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [filters, setFilters] = useState({
    country: "",
    cause: "",
    minSeverity: 0,
  });

  const handleFileLoad = useCallback((content: string, filename: string) => {
    console.log("[v0] Parsing file:", filename);
    const parsed = parseCSV(content);
    console.log("[v0] Parsed rows:", parsed.length);
    setData(parsed);
    setSelectedPoint(null);
    setFilters({ country: "", cause: "", minSeverity: 0 });
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((point) => {
      if (filters.country && point.Country !== filters.country) return false;
      if (filters.cause) {
        const cause = point.categorised_cause || point.MainCause || "Unknown";
        if (cause !== filters.cause) return false;
      }
      if (point.Severity < filters.minSeverity) return false;
      return true;
    });
  }, [data, filters]);

  const stats = useMemo(() => calculateStats(filteredData), [filteredData]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary">
              <Map className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Disaster Data Mapper
              </h1>
              <p className="text-sm text-muted-foreground">
                Visualize disaster datasets on an interactive map
              </p>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
            <button
              onClick={() => setViewMode("map")}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1.5 ${
                viewMode === "map"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Map className="w-4 h-4" />
              Map
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1.5 ${
                viewMode === "split"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Split
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1.5 ${
                viewMode === "table"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Table className="w-4 h-4" />
              Table
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-4 space-y-4">
        {/* File Upload */}
        <FileDropzone onFileLoad={handleFileLoad} />

        {data.length > 0 && (
          <>
            {/* Stats */}
            <StatsPanel stats={stats} />

            {/* Filters */}
            <FilterPanel
              data={data}
              filters={filters}
              onFiltersChange={setFilters}
            />

            {/* Map and Table */}
            <div
              className={`grid gap-4 ${
                viewMode === "split"
                  ? "grid-cols-1 lg:grid-cols-2"
                  : "grid-cols-1"
              }`}
            >
              {(viewMode === "map" || viewMode === "split") && (
                <div className="bg-card rounded-lg border border-border overflow-hidden relative min-h-[500px]">
                  <MapView
                    data={filteredData}
                    selectedPoint={selectedPoint}
                    onSelectPoint={setSelectedPoint}
                  />
                  <SeverityLegend />
                </div>
              )}

              {(viewMode === "table" || viewMode === "split") && (
                <div className="bg-card rounded-lg border border-border overflow-hidden">
                  <div className="p-4 border-b border-border">
                    <h2 className="font-medium text-foreground">
                      Data Table
                      <span className="ml-2 text-sm text-muted-foreground">
                        ({filteredData.length} events)
                      </span>
                    </h2>
                  </div>
                  <DataTable
                    data={filteredData}
                    selectedPoint={selectedPoint}
                    onSelectPoint={setSelectedPoint}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {/* Empty State */}
        {data.length === 0 && (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                <Map className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                No Data Loaded
              </h2>
              <p className="text-muted-foreground mb-4">
                Drop a CSV file above to visualize your disaster dataset on the
                map. Your file should include columns for latitude, longitude,
                country, and severity.
              </p>
              <div className="text-left bg-secondary/50 rounded-lg p-4 text-sm">
                <p className="font-medium text-foreground mb-2">
                  Expected columns:
                </p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>
                    <code className="text-primary">lat</code> - Latitude
                  </li>
                  <li>
                    <code className="text-primary">long</code> - Longitude
                  </li>
                  <li>
                    <code className="text-primary">Country</code> - Country name
                  </li>
                  <li>
                    <code className="text-primary">Severity</code> - Severity
                    level (1-3)
                  </li>
                  <li>
                    <code className="text-primary">Dead</code> - Number of
                    deaths (optional)
                  </li>
                  <li>
                    <code className="text-primary">Displaced</code> - Number
                    displaced (optional)
                  </li>
                  <li>
                    <code className="text-primary">MainCause</code> - Cause
                    description (optional)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
