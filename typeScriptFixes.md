# TypeScript Fixes

If you're using TypeScript and encounter type errors in your Mapbox React components, here are the complete solutions with proper type annotations:

## 1. Map Component Fixes

### Fixed Map.tsx

```typescript
import "mapbox-gl/dist/mapbox-gl.css";
import { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

import "./App.css";

function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [earthquakeData, setEarthquakeData] = useState();

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
      zoom: 5.5,
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

  return <div ref={mapContainer} id="map-container" />;
}

export default Map;
```

## 2. Marker Component Fixes

### Fixed Marker.tsx

```typescript
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { createPortal } from "react-dom";

// Define types for the props
interface MarkerProps {
  map: mapboxgl.Map;
  feature: {
    geometry: {
      coordinates: [number, number];
    };
    properties: {
      mag: number;
    };
  };
}

const Marker = ({ map, feature }: MarkerProps) => {
  const { geometry, properties } = feature;

  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const contentRef = useRef(document.createElement("div"));

  useEffect(() => {
    markerRef.current = new mapboxgl.Marker(contentRef.current)
      .setLngLat([geometry.coordinates[0], geometry.coordinates[1]])
      .addTo(map);

    return () => {
      markerRef.current?.remove();
    };
  }, [map, geometry.coordinates]);

  return (
    <>
      {createPortal(
        <div
          style={{
            display: "inline-block",
            padding: "2px 10px",
            borderRadius: "50px",
            backgroundColor: "#fff",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#333",
            textAlign: "center",
          }}
        >
          {properties.mag}
        </div>,
        contentRef.current
      )}
    </>
  );
};

export default Marker;
```

## 3. App Component Fixes

### Fixed App.tsx

```typescript
import Map from "./Map";

function App() {
  return (
    <>
      <Map />
    </>
  );
}

export default App;
```

## What These Fixes Address

### Common TypeScript Errors and Solutions:

#### 1. **Null/Undefined Safety**
- **Problem**: `'bounds' is possibly 'null' or 'undefined'`
- **Solution**: Added null checks with `if (!bounds) return;`
- **Problem**: `'markerRef.current' is possibly 'null'`
- **Solution**: Used optional chaining `markerRef.current?.remove()`

#### 2. **Implicit 'any' Types**
- **Problem**: `'map'` and `'feature'` implicitly have 'any' type
- **Solution**: Added `MarkerProps` interface with proper type definitions
- **Problem**: `useRef()` without type annotations
- **Solution**: Added proper types like `useRef<mapboxgl.Map | null>(null)`

#### 3. **Type Assignment Issues**
- **Problem**: Type 'Map' is not assignable to type 'null'
- **Solution**: Proper type annotations for refs
- **Problem**: Type 'undefined' is not assignable to type 'string | HTMLElement'
- **Solution**: Used non-null assertion `mapContainer.current!`

#### 4. **Missing Required Properties**
- **Problem**: Mapbox constructor missing required 'style' property
- **Solution**: Added `style: "mapbox://styles/mapbox/streets-v12"`

#### 5. **useEffect Dependencies**
- **Problem**: Missing dependencies in useEffect
- **Solution**: Added proper dependencies like `[getBboxAndFetch]` and `[map, geometry.coordinates]`

### Key Improvements Made:

- **Interface Definitions**: Added proper TypeScript interfaces
- **Ref Types**: Properly typed all useRef hooks
- **Null Safety**: Added comprehensive null checking
- **Error Handling**: Added try-catch blocks and error logging
- **Cleanup Functions**: Proper cleanup with null checks
- **Dependencies**: Correct useEffect dependency arrays
- **Console Logging**: Added debugging logs for development

### Best Practices Implemented:

1. **Always check for null/undefined** before accessing properties
2. **Use proper type annotations** for all refs and props
3. **Implement proper cleanup** in useEffect return functions
4. **Add error boundaries** around async operations
5. **Use optional chaining** (`?.`) for safe property access
6. **Include proper dependencies** in useEffect arrays

These fixes ensure your Mapbox React application compiles without TypeScript errors while maintaining all functionality and following TypeScript best practices.