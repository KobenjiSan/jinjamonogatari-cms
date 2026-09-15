import { useEffect, useRef, useState } from "react";
import styles from "./MapContainer.module.css";
import {
  GeoJSONSource,
  Map as MapLibreMap,
  Marker,
  NavigationControl,
  Popup,
  setWorkerUrl,
} from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import {
  getShrineMapPoints,
  getShrineMapPopup,
  type ShrineMapPointsCMSDto,
} from "../mapApi";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";
import MapPopup from "../MapPopup/MapPopup";
import type { ShrineListDto } from "../../shrines/shrinesApi";

setWorkerUrl(workerUrl);

const DEFAULT_CENTER = { lat: 34.7, lng: 135.5 };

// MAP KEY
const MAPTILER_KEY = import.meta.env.VITE_PUBLIC_MAPTILER_KEY;
if (!MAPTILER_KEY) throw new Error("Missing VITE_PUBLIC_MAPTILER_KEY");
const mapTilerKey: string = MAPTILER_KEY;

// MAP STYLE
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

// COMPONENT
export default function MapContainer() {
  // LOAD POINTS FROM API
  const [shrinePoints, setShrinePoints] = useState<ShrineMapPointsCMSDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShrinePoints() {
      setLoading(true);

      try {
        const result = await getShrineMapPoints();
        setShrinePoints(result);
      } catch (error) {
        console.error("Failed to retrieve shrine points", error);
        const err = error as { message?: string };
        toast.error(err.message ?? "Failed to retrieve shrine points");
        setShrinePoints([]);
      } finally {
        setLoading(false);
      }
    }

    loadShrinePoints();
  }, []);

  // POPUP MANAGEMENT
  const [popupState, setPopupState] = useState<{
    container: HTMLElement;
    shrine: ShrineListDto;
  } | null>(null);

  const popupRef = useRef<Popup | null>(null);
  const popupRequestRef = useRef(0);

  // MAP REFERENCES
  const mapContainerRef = useRef<HTMLDivElement | null>(null); // references the HTML <div> containing the map
  const mapRef = useRef<MapLibreMap | null>(null); // MapLibre map reference so React doesn’t create another during rerenders

  // BUILD MAP
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new MapLibreMap({
      container: mapContainerRef.current,
      style: `${mapTilerStyleUrl()}?key=${mapTilerKey}`,
      center: DEFAULT_CENTER,
      zoom: 10,
    });

    map.addControl(new NavigationControl(), "top-right");

    // new Marker().setLngLat(DEFAULT_CENTER).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

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
            "circle-radius": 7,
            "circle-color": "#c83232",
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": 2,
          },
        });

        // MOUSE HOVER
        map.on("mouseenter", "shrine-points", () => {
          map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", "shrine-points", () => {
          map.getCanvas().style.cursor = "";
        });

        // MAP CLICK
        map.on("click", "shrine-points", async (event) => {
          const feature = event.features?.[0];
          const shrineId = feature?.properties?.shrineId;

          if (shrineId === undefined || shrineId === null) return;

          const requestId = ++popupRequestRef.current;

          popupRef.current?.remove();

          try {
            const result = await getShrineMapPopup(shrineId);

            const shrine = result.shrineMapPopup;

            // The user clicked another shrine while this was loading.
            if (requestId !== popupRequestRef.current) return;

            const container = document.createElement("div");

            const popup = new Popup({
              className: styles.shrinePopup,
              maxWidth: "350px",
            })
              .setLngLat(event.lngLat)
              .setDOMContent(container)
              .addTo(map);

            popupRef.current = popup;

            setPopupState({
              container,
              shrine,
            });

            popup.on("close", () => {
              if (popupRef.current === popup) {
                popupRef.current = null;
                setPopupState(null);
              }
            });
          } catch (error) {
            if (requestId !== popupRequestRef.current) return;

            console.error("Failed to load shrine", error);
            const err = error as { message?: string };
            toast.error(err.message ?? "Something went wrong");
          }
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

  return (
    <>
      <div ref={mapContainerRef} className={styles.map} />

      {popupState &&
        createPortal(
          <MapPopup shrine={popupState.shrine} />,
          popupState.container,
        )}
    </>
  );
}
