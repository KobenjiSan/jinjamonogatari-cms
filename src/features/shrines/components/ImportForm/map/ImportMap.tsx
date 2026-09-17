import { useEffect, useRef, useState } from "react";
import styles from "./ImportMap.module.css";
import {
  GeoJSONSource,
  LngLat,
  Map as MapLibreMap,
  Marker,
  setWorkerUrl,
} from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import {
  getShrineMapPoints,
  type ShrineMapPointsCMSDto,
} from "../../../../map/mapApi";
import toast from "react-hot-toast";
import circle from "@turf/circle";

setWorkerUrl(workerUrl);

const DEFAULT_CENTER = { lat: 35.0116, lng: 135.7681 };

const MAPTILER_KEY = import.meta.env.VITE_PUBLIC_MAPTILER_KEY;
if (!MAPTILER_KEY) throw new Error("Missing VITE_PUBLIC_MAPTILER_KEY");
const mapTilerKey: string = MAPTILER_KEY;

const LIGHT_STYLE_ID = "019c2031-d766-7298-bdc2-c88076ef2f99";
// const DARK_STYLE_ID = "dataviz-dark";
function mapTilerStyleUrl() {
  return `https://api.maptiler.com/maps/${LIGHT_STYLE_ID}/style.json`;
}

// CONVERT SHRINES TO GeoJSON
function toShrineGeoJson(shrines: ShrineMapPointsCMSDto[]) {
  return {
    type: "FeatureCollection" as const, // FeatureCollection is all shrines, 'as const' stops TypeScript from treating "Feat..." as arbitrary string
    features: shrines.map((shrine) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [shrine.lon, shrine.lat],
      },
      properties: {
        shrineId: shrine.shrineId,
        status: shrine.status,
      },
    })),
  };
}

type ImportMapProps = {
  onHasCenterPoint: (center: { lat: number; lon: number }) => void;
  searchSize: string;
};

export default function ImportMap({
  onHasCenterPoint,
  searchSize,
}: ImportMapProps) {
  // LOAD POINTS FROM API
  const [shrinePoints, setShrinePoints] = useState<ShrineMapPointsCMSDto[]>([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShrinePoints() {
      // setLoading(true);

      try {
        const result = await getShrineMapPoints();
        setShrinePoints(result);
      } catch (error) {
        console.error("Failed to retrieve shrine points", error);
        const err = error as { message?: string };
        toast.error(err.message ?? "Failed to retrieve shrine points");
        setShrinePoints([]);
      } finally {
        // setLoading(false);
      }
    }

    loadShrinePoints();
  }, []);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  // BUILD MAP
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new MapLibreMap({
      container: mapContainerRef.current,
      style: `${mapTilerStyleUrl()}?key=${mapTilerKey}`,
      center: DEFAULT_CENTER,
      zoom: 12,
    });

    mapRef.current = map;

    map.getCanvas().style.cursor = "pointer";

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Marker
  const [centerPoint, setCenterPoint] = useState<LngLat | null>(null);
  const centerMarkerRef = useRef<Marker | null>(null);

  function mapSearchSizeToRadius(size: string): number {
    switch (size) {
      case "small":
        return 1000;
      case "medium":
        return 3000;
      case "large":
        return 5000;
      default:
        return 0;
    }
  }

  // HANDLE CLICK EVENT
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // USER CLICK
    map.on("click", (e) => {
      // set marker
      if (centerMarkerRef.current) {
        centerMarkerRef.current.remove();
      }
      const marker = new Marker().setLngLat(e.lngLat).addTo(map);
      centerMarkerRef.current = marker;
      setCenterPoint(e.lngLat);

      // output current postion
      onHasCenterPoint({ lat: e.lngLat.lat, lon: e.lngLat.lng });
    });
  }, []);

  // HANDLE RADIUS
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const syncRadius = () => {
      const radiusMeters = mapSearchSizeToRadius(searchSize);

      const radiusData =
        centerPoint && radiusMeters > 0
          ? circle([centerPoint.lng, centerPoint.lat], radiusMeters, {
              units: "meters",
              steps: 64,
            })
          : {
              type: "FeatureCollection" as const,
              features: [],
            };

      if (!map.getSource("search-radius")) {
        map.addSource("search-radius", {
          type: "geojson",
          data: radiusData,
        });
      } else {
        const source = map.getSource("search-radius") as GeoJSONSource;
        source.setData(radiusData);
      }

      if (!map.getLayer("search-radius-fill")) {
        map.addLayer({
          id: "search-radius-fill",
          type: "fill",
          source: "search-radius",
          paint: {
            "fill-color": "#2563eb",
            "fill-opacity": 0.15,
          },
        });
      }

      if (!map.getLayer("search-radius-outline")) {
        map.addLayer({
          id: "search-radius-outline",
          type: "line",
          source: "search-radius",
          paint: {
            "line-color": "#2563eb",
            "line-width": 2,
          },
        });
      }
    };

    if (map.isStyleLoaded()) {
      syncRadius();
    } else {
      map.once("load", syncRadius);
    }

    return () => {
      map.off("load", syncRadius);
    };
  }, [searchSize, centerPoint]);

  // ADD POINTS TO MAP
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const syncShrines = () => {
      const geoJson = toShrineGeoJson(shrinePoints);
      const existingSource = map.getSource("shrines") as
        | GeoJSONSource
        | undefined;

      if (existingSource) {
        existingSource.setData(geoJson);
      } else {
        map.addSource("shrines", {
          type: "geojson",
          data: geoJson,
        });
      }

      if (!map.getLayer("shrine-points")) {
        map.addLayer({
          id: "shrine-points",
          type: "circle",
          source: "shrines",
          paint: {
            "circle-radius": 6,
            "circle-color": "blue",
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": 1,
            "circle-opacity": 0.4,
          },
        });
      }
    };

    if (map.isStyleLoaded()) {
      syncShrines();
    } else {
      map.once("load", syncShrines);
    }

    return () => {
      map.off("load", syncShrines);
    };
  }, [shrinePoints]);

  return <div ref={mapContainerRef} className={styles.map} />;
}
