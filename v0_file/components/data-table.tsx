"use client";

import type { DataPoint } from "@/lib/types";
import { MapPin } from "lucide-react";

interface DataTableProps {
  data: DataPoint[];
  selectedPoint: DataPoint | null;
  onSelectPoint: (point: DataPoint) => void;
}

const getSeverityColor = (severity: number): string => {
  if (severity <= 1) return "bg-green-500";
  if (severity <= 1.5) return "bg-yellow-500";
  if (severity <= 2) return "bg-orange-500";
  return "bg-red-500";
};

export function DataTable({
  data,
  selectedPoint,
  onSelectPoint,
}: DataTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No data loaded. Drop a CSV file to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto max-h-[400px]">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-card border-b border-border">
          <tr className="text-left text-muted-foreground">
            <th className="p-3 font-medium">Country</th>
            <th className="p-3 font-medium">Cause</th>
            <th className="p-3 font-medium text-right">Severity</th>
            <th className="p-3 font-medium text-right">Deaths</th>
            <th className="p-3 font-medium text-right">Displaced</th>
            <th className="p-3 font-medium text-center">Map</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((point, index) => (
            <tr
              key={`${point.ID || index}-${point.Country}`}
              className={`
                hover:bg-secondary/50 cursor-pointer transition-colors
                ${selectedPoint === point ? "bg-primary/10" : ""}
              `}
              onClick={() => onSelectPoint(point)}
            >
              <td className="p-3 font-medium text-foreground">
                {point.Country}
              </td>
              <td className="p-3 text-muted-foreground">
                {point.categorised_cause || point.MainCause || "Unknown"}
              </td>
              <td className="p-3 text-right">
                <span className="inline-flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${getSeverityColor(point.Severity)}`}
                  />
                  {point.Severity}
                </span>
              </td>
              <td className="p-3 text-right text-foreground">
                {point.Dead?.toLocaleString() || "-"}
              </td>
              <td className="p-3 text-right text-foreground">
                {point.Displaced?.toLocaleString() || "-"}
              </td>
              <td className="p-3 text-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPoint(point);
                  }}
                  className="p-1.5 rounded hover:bg-primary/20 text-primary transition-colors"
                  aria-label={`View ${point.Country} on map`}
                >
                  <MapPin className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
