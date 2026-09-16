import { useEffect, useRef } from "react";
import styles from "./MetaMap.module.css";
import { Map as MapLibreMap,
  Marker,
  setWorkerUrl,
 } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";

setWorkerUrl(workerUrl);

const MAPTILER_KEY = import.meta.env.VITE_PUBLIC_MAPTILER_KEY;
if (!MAPTILER_KEY) throw new Error("Missing VITE_PUBLIC_MAPTILER_KEY");
const mapTilerKey: string = MAPTILER_KEY;

const LIGHT_STYLE_ID = "019c2031-d766-7298-bdc2-c88076ef2f99";
// const DARK_STYLE_ID = "dataviz-dark";
function mapTilerStyleUrl() {
  return `https://api.maptiler.com/maps/${LIGHT_STYLE_ID}/style.json`;
}

type MetaMapProps = {
  location: {
    lat: number,
    lon: number
  };
};

export default function MetaMap({
    location
}: MetaMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null); 
  const mapRef = useRef<MapLibreMap | null>(null); 

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new MapLibreMap({
      container: mapContainerRef.current,
      style: `${mapTilerStyleUrl()}?key=${mapTilerKey}`,
      center: [location.lon, location.lat],
      zoom: 16,
      interactive: false,
    });

    new Marker()
      .setLngLat([location.lon, location.lat])
      .addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null
    };
  }, []);

  return <div ref={mapContainerRef} className={styles.map} />;
}
