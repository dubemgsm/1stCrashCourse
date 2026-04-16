"use client";

import type { DataStats } from "@/lib/types";
import { Users, AlertTriangle, Globe, Activity } from "lucide-react";

interface StatsPanelProps {
  stats: DataStats;
}

export function StatsPanel({ stats }: StatsPanelProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toLocaleString();
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-card rounded-lg p-4 border border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {formatNumber(stats.totalEvents)}
            </p>
            <p className="text-sm text-muted-foreground">Events</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-4 border border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-destructive/20">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {formatNumber(stats.totalDeaths)}
            </p>
            <p className="text-sm text-muted-foreground">Deaths</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-4 border border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-chart-2/20">
            <Users className="w-5 h-5 text-chart-2" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {formatNumber(stats.totalDisplaced)}
            </p>
            <p className="text-sm text-muted-foreground">Displaced</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-4 border border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-chart-4/20">
            <Globe className="w-5 h-5 text-chart-4" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {stats.countriesAffected}
            </p>
            <p className="text-sm text-muted-foreground">Countries</p>
          </div>
        </div>
      </div>
    </div>
  );
}
