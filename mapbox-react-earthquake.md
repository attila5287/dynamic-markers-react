
# 🌍 Dynamic Earthquake Map with React + Mapbox GL JS

This tutorial demonstrates how to create a **dynamic, data-driven map** using **React**, **Mapbox GL JS**, and the **USGS Earthquake API**. The map fetches earthquake data dynamically based on the visible bounding box whenever the map is loaded or moved.

---

## 🚀 Features

- Built with **React** functional components and hooks
- Uses `mapbox-gl` to render the interactive map
- Fetches earthquake data from the **USGS API**
- Auto-updates based on the current map view (bounding box)
- Uses `useCallback`, `useRef`, `useEffect`, and `useState` for optimal React state and side-effect management

---

## 📦 Required Packages

```bash
npm install mapbox-gl
```

Also ensure your `App.css` includes full-screen layout:

```css
#map-container {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
```

---

## 📁 Final Code: `Map.jsx`

```tsx
import React, { useEffect, useRef, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css'

function Map() {
    const mapRef = useRef()
    const mapContainerRef = useRef()

    const [earthquakeData, setEarthquakeData] = useState()

    const getBboxAndFetch = useCallback(async () => {
        const bounds = mapRef.current.getBounds()

        try {
            const data = await fetch(\`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2024-01-01&endtime=2024-01-30&minlatitude=\${bounds._sw.lat}&maxlatitude=\${bounds._ne.lat}&minlongitude=\${bounds._sw.lng}&maxlongitude=\${bounds._ne.lng}\`)
                .then(d => d.json())

            setEarthquakeData(data)
        } catch (error) {
            console.error(error)
        }
    }, [])

    useEffect(() => {
        mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: [116.14815, -1.99628],
            minZoom: 5.5,
            zoom: 5.5
        });

        mapRef.current.on('load', () => {
            getBboxAndFetch()
        })

        mapRef.current.on('moveend', () => {
            getBboxAndFetch()
        })

        return () => {
            mapRef.current.remove()
        }
    }, [])

    console.log(earthquakeData)

    return (
        <>
            <div id='map-container' ref={mapContainerRef} />
        </>
    )
}

export default Map
```

---

## 🔍 How It Works

### 1. **Refs**
- `mapRef`: holds the Mapbox map instance
- `mapContainerRef`: refers to the HTML container for rendering the map

### 2. **useEffect**
- Initializes the map only once
- Adds `load` and `moveend` listeners to dynamically fetch data

### 3. **useCallback: `getBboxAndFetch`**
- Uses the map’s bounding box to fetch earthquake data from the [USGS Earthquake API](https://earthquake.usgs.gov/fdsnws/event/1/)
- Updates `earthquakeData` state

---

## 🧠 Notes

- The USGS query is **date-limited**; you can extend or parameterize the dates
- You can enhance the app by:
  - Adding **markers** for each earthquake
  - Displaying popups with magnitude/location
  - Adding a side panel for data summary

---

## 📍 Example Enhancement

```tsx
map.on('click', 'earthquakes', (e) => {
  new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(\`<strong>Magnitude:</strong> \${e.features[0].properties.mag}\`)
    .addTo(map);
});
```

---

## ✅ Summary

This template can be adapted for any data source that supports bounding box filters. Perfect for **environmental monitoring**, **live data dashboards**, or **geospatial analysis tools**.

