import "mapbox-gl/dist/mapbox-gl.css";
import { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import Marker from "./components/Marker.tsx";
import Popup from "./components/Popup.tsx";
import "./App.css";

function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [earthquakeData, setEarthquakeData] = useState<any>(null);
  const [activeFeature, setActiveFeature] = useState<any>(null);
  const getBboxAndFetch = useCallback(async () => {
    const bounds = map.current?.getBounds();

    if (!bounds) {
      console.log("No bounds available yet");
      return;
    }

    console.log("Fetching earthquake data...");
    console.log("Bounds:", bounds);

    try {
      const data = await fetch(
        `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2024-01-01&endtime=2024-01-30&minlatitude=${bounds._sw.lat}&maxlatitude=${bounds._ne.lat}&minlongitude=${bounds._sw.lng}&maxlongitude=${bounds._ne.lng}`
      ).then((d) => d.json());

      console.log("Earthquake API Response:", data);
      console.log("Number of earthquakes:", data.features?.length || 0);
      
      if (data.features && data.features.length > 0) {
        console.log("Sample earthquake:", data.features[0]);
      }

      setEarthquakeData(data);
    } catch (error) {
      console.error("Error fetching earthquake data:", error);
    }
  }, []);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    console.log("Starting map initialization...");
    console.log("Container:", mapContainer.current);

    // Set access token
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYXR0aWxhNTIiLCJhIjoiY2thOTE3N3l0MDZmczJxcjl6dzZoNDJsbiJ9.bzXjw1xzQcsIhjB_YoAuEw";

    // Create the map
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [116.14815, -1.99628], // Indonesia coordinates
      zoom: 5.0,
    });

    console.log("Map instance created:", map.current);

    // Add event listeners
    map.current.on("load", () => {
      console.log("Map loaded successfully!");
      getBboxAndFetch(); // Fetch data when map loads
    });

    map.current.on("moveend", () => {
      console.log("Map moved, fetching new data...");
      getBboxAndFetch(); // Fetch data when map stops moving
    });

    map.current.on("error", (e) => {
      console.error("Map error:", e);
    });

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [getBboxAndFetch]);

  // Log earthquake data when it changes
  useEffect(() => {
    if (earthquakeData) {
      console.log("Earthquake data updated:", earthquakeData);
    }
  }, [earthquakeData]);

  const handleMarkerClick = (feature: any) => {
    console.log("Marker clicked:", feature);
    setActiveFeature(feature);
  };

  return (
    <>
      <div ref={mapContainer} id="map-container" />
      
      {map.current && earthquakeData && earthquakeData.features?.map((feature: any) => (
        <Marker 
          key={feature.id}
          map={map.current!}
          feature={feature}
          isActive={activeFeature?.id === feature.id}
          onClick={handleMarkerClick}
        />
      ))}
      {map.current && activeFeature && (
        <Popup map={map.current} activeFeature={activeFeature} />
      )}
    </>
  );
}

export default Map;
