"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { DataPoint } from "@/lib/types";

interface MapViewProps {
  data: DataPoint[];
  selectedPoint: DataPoint | null;
  onSelectPoint: (point: DataPoint | null) => void;
}

const getSeverityColor = (severity: number): string => {
  if (severity <= 1) return "#22c55e"; // green - low
  if (severity <= 1.5) return "#eab308"; // yellow - medium
  if (severity <= 2) return "#f97316"; // orange - high
  return "#ef4444"; // red - critical
};

const getSeverityRadius = (severity: number): number => {
  return Math.max(8, severity * 8);
};

export function MapView({ data, selectedPoint, onSelectPoint }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    // Initialize map
    mapRef.current = L.map(mapContainer.current, {
      center: [0, 20],
      zoom: 2,
      zoomControl: true,
      attributionControl: true,
    });

    // Add dark tile layer
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when data changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (data.length === 0) return;

    // Add new markers
    data.forEach((point) => {
      if (
        typeof point.lat !== "number" ||
        typeof point.long !== "number" ||
        isNaN(point.lat) ||
        isNaN(point.long)
      ) {
        return;
      }

      const marker = L.circleMarker([point.lat, point.long], {
        radius: getSeverityRadius(point.Severity),
        fillColor: getSeverityColor(point.Severity),
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      });

      // Create popup content
      const popupContent = `
        <div class="p-2 min-w-[200px]">
          <h3 class="font-bold text-lg mb-2">${point.Country}</h3>
          <div class="space-y-1 text-sm">
            <p><strong>Cause:</strong> ${point.MainCause || point.categorised_cause || "Unknown"}</p>
            <p><strong>Severity:</strong> ${point.Severity}</p>
            <p><strong>Deaths:</strong> ${point.Dead?.toLocaleString() || "N/A"}</p>
            <p><strong>Displaced:</strong> ${point.Displaced?.toLocaleString() || "N/A"}</p>
            <p><strong>Area:</strong> ${point.Area?.toLocaleString() || "N/A"} km²</p>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on("click", () => {
        onSelectPoint(point);
      });

      marker.addTo(mapRef.current!);
      markersRef.current.push(marker);
    });

    // Fit bounds to markers if we have data
    if (markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      mapRef.current.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
  }, [data, onSelectPoint]);

  // Handle selected point
  useEffect(() => {
    if (!mapRef.current || !selectedPoint) return;

    if (
      typeof selectedPoint.lat === "number" &&
      typeof selectedPoint.long === "number"
    ) {
      mapRef.current.setView([selectedPoint.lat, selectedPoint.long], 6);
    }
  }, [selectedPoint]);

  return (
    <div
      ref={mapContainer}
      className="h-full w-full rounded-lg overflow-hidden"
      style={{ minHeight: "400px" }}
    />
  );
}
