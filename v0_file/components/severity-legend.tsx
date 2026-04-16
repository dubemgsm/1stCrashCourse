"use client";

export function SeverityLegend() {
  const levels = [
    { label: "Low (≤1)", color: "bg-green-500" },
    { label: "Medium (≤1.5)", color: "bg-yellow-500" },
    { label: "High (≤2)", color: "bg-orange-500" },
    { label: "Critical (>2)", color: "bg-red-500" },
  ];

  return (
    <div className="absolute bottom-4 left-4 z-[1000] bg-card/95 backdrop-blur-sm rounded-lg p-3 border border-border">
      <p className="text-xs font-medium text-foreground mb-2">Severity Level</p>
      <div className="space-y-1.5">
        {levels.map((level) => (
          <div key={level.label} className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${level.color}`} />
            <span className="text-xs text-muted-foreground">{level.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
