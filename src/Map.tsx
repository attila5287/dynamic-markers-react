import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

import "./App.css";

function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    
    console.log("Initializing Mapbox map...");
    
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYXR0aWxhNTIiLCJhIjoiY2thOTE3N3l0MDZmczJxcjl6dzZoNDJsbiJ9.bzXjw1xzQcsIhjB_YoAuEw";
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-74.5, 40],
        zoom: 9,
      });
      
      console.log("Mapbox map initialized successfully");
    } catch (error) {
      console.error("Error initializing Mapbox map:", error);
    }
  }, []);

  return (
    <div ref={mapContainer} id="map-container" />
  );
}

export default Map;
