# Mapbox React Tutorial: Add Dynamic Markers to a Map

## Table of Contents

- [Step 3: Set up a React app and add a map](#3-step-set-up-a-react-app-and-add-a-map)
- [Step 4: Configure camera and fetch data](#4-step)
- [Step 5: Add markers to the map](#5-step)
- [Step 6: Customize the markers](#6-step)
- [TypeScript Fixes](./typeScriptFixes.md)

---

# 3 step Set up a React app and add a map
Set up a React app and add a map

> To start, set up a new React app with Vite and add a full-screen 
> Mapbox GL JS Map to it: TUTORIAL Use Mapbox GL JS in a React App
> Review our [introductory tutorial](https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/?step=2) to learn how to get a basic Mapbox GL JS map working in a React App.

The following `Map` component renders a Mapbox GL JS map in a React app. 

Include it in your React app and be sure to add CSS as needed to give the map container a height and width.

### App.css

```CSS
#map-container {
  width: 100%;
  height: 100vh;
  position: relative;
  background-color: #f0f0f0; /* Add background color to see if container is visible */
}

/* Ensure the map takes up the full viewport */
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

/* Make sure the root element also takes full height */
#root {
  height: 100%;
  width: 100%;
}

/* Ensure the map canvas is visible */
.mapboxgl-canvas {
  width: 100% !important;
  height: 100% !important;
}

```

### src/Map.jsx

```JS
import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css'


function Map() {

    const mapRef = useRef()
    const mapContainerRef = useRef()

    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYXR0aWxhNTIiLCJhIjoiY2thOTE3N3l0MDZmczJxcjl6dzZoNDJsbiJ9.bzXjw1xzQcsIhjB_YoAuEw'
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
        });

        return () => {
            mapRef.current.remove()
        }
    }, [])

    return (
        <>
            <div id='map-container' ref={mapContainerRef} />
        </>
    )
}

export default Map
```
Run the development server and open your browser to see the map.
`npm run dev`

# 4 step
## Configure camera
Before setting up data fetching, configure your map's camera settings to make sure the map is zoomed in on an area that will include earthquakes for the given date range. Set the center and zoom options to focus on an earthquake-prone area such as Indonesia to make sure that markers will be visible in the initial view. Setting minZoom to 5.5 will prevent the user from zooming out past the initial view, which keeps the bounding boxes smaller to avoid responses with hundreds or even thousands of earthquakes.

Mapbox provides the handy Location Helper tool to help you get center and zoom values when setting up a map. You can use it to find coordinates for a specific location if you want to try loading data for another part of the world.

Add options in the Map component to set the initial view.

### src/Map.jsx

```
mapRef.current = new mapboxgl.Map({
    container: mapContainerRef.current,

    center: [124, -1.98],

    minZoom: 5.5,

    zoom: 5.5
});
```

## Fetch data from an API using the map bounds

This tutorial uses data from the U.S. Geological Survey (USGS) Earthquake Catalog. The Earthquake Catalog has an API which returns a list of earthquakes with their coordinates, magnitude, and other details. It is queryable by timestamp and geographic location (bounding box) and several other parameters. It is also a public API, so you can use it without an API key.

To familiarize yourself with the data, load this URL in your browser:

**Request URL**
https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2025-01-01&endtime=2025-01-02&minmagnitude=4

This URL fetches all earthquakes with a magnitude of 4 or higher on January 1, 2025. You can see that the response is a `GeoJSON FeatureCollection`, with each earthquake represented as a `Feature`. Each `Feature` has a unique id, geometry including the earthquake's geographic point coordinates, and properties with details about the earthquake.


## Set up data fetching

With the map loaded and zoomed in to an area of interest, you are ready to fetch data to use to add markers. The goal is to not fetch data only once for the initial bounding box, but to fetch new data whenever the user updates the map view by zooming or panning.

To do this, you want to trigger the fetch function once when the map loads, and again on every following move using the moveend event.

First, set up a state variable `earthquakeData` to store the fetched data.

Next, add a function `getBboxAndFetch` to your Map component. Wrap it in React's `useCallback` hook to prevent it from being recreated on every render. This function will gets the current map's bounds by calling `getBounds` on the map instance. It then builds out an API URL with the bounds and fetches the data.  

The API call includes data for January 2025, and the bounding box coordinates are passed in as query parameters. The response is then set as the earthquakeData state.


```JS
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
            const data = await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2024-01-01&endtime=2024-01-30&minlatitude=${bounds._sw.lat}&maxlatitude=${bounds._ne.lat}&minlongitude=${bounds._sw.lng}&maxlongitude=${bounds._ne.lng}`)
                .then(d => d.json())
    
            setEarthquakeData(data)
        } catch (error) {
            console.error(error)
        }
    }, [])
```

To trigger getBboxAndFetch, add two event listeners to the useEffect that runs when the Map component mounts. The first will fire on load, and the second on moveend.

Add a console log to see the fetched data in the console.

```JS
    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYXR0aWxhNTIiLCJhIjoiY2thOTE3N3l0MDZmczJxcjl6dzZoNDJsbiJ9.bzXjw1xzQcsIhjB_YoAuEw'
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
```

You will see earthquakeData appear in the developer console as undefined on the early renders of Map, then once the map loads, the data will be fetched and logged to the console. Drag the map to a new location to trigger additional API calls and see the logged data change.

Your Map component code should look like this:

```JS
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
            const data = await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2024-01-01&endtime=2024-01-30&minlatitude=${bounds._sw.lat}&maxlatitude=${bounds._ne.lat}&minlongitude=${bounds._sw.lng}&maxlongitude=${bounds._ne.lng}`)
                .then(d => d.json())

            setEarthquakeData(data)
   
   } catch (error) {
            console.error(error)
        }
    }, [])

    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYXR0aWxhNTIiLCJhIjoiY2thOTE3N3l0MDZmczJxcjl6dzZoNDJsbiJ9.bzXjw1xzQcsIhjB_YoAuEw'
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
With your data flowing, you are ready to add markers to the map.

# 5 Step 
To add markers to the map, you will create a new React component Marker that will render a marker for each earthquake in the fetched data. Marker implements the mapboxgl.Marker class and handles the full lifecycle of a marker, adding it to the map when it mounts and removing it when it unmounts.

Before customizing the markers, start with a minimal implementation that adds a default Mapbox GL JS marker to the map for each earthquake.

Create Marker.jsx in the src directory and add the following code. Marker receives the Map instance and the earthquake Feature's geometry as props, and creates a default mapboxgl.Marker instance on mount using useEffect. Note the return in the useEffect that removes the marker when the component unmounts.

You can use the geometry prop to set the marker's position using the setLngLat method before adding it to the map with addTo.
src/Marker.jsx

```JS
import { useEffect, useRef } from "react"
import mapboxgl from 'mapbox-gl'


const Marker = ({ map, feature }) => {
    const { geometry } = feature

    const markerRef = useRef()

    useEffect(() => {
        markerRef.current = new mapboxgl.Marker()
            .setLngLat([geometry.coordinates[0], geometry.coordinates[1]])
            .addTo(map)

        return () => {
             markerRef.current.remove()
        }
    }, [])

    return null
}

export default Marker
```

Add an iterator to the Map component that maps over earthquakeData and renders a Marker component for each earthquake. Pass the earthquake feature into Marker as a prop.

> Note that feature.id is used to set the key prop. When the user 
changes the map view, the next API response may include data for 
earthquakes that are already represented by markers on the map. React 
will use the key to determine which earthquakes need a new instance of 
the Marker component and which can be reused.

### src/Map.jsx

```JS

import Marker from './Marker'
// ...
    return (
        <>
            <div id='map-container' ref={mapContainerRef} />

            {mapRef.current && earthquakeData && earthquakeData.features?.map((feature) => {

                return (<Marker

                    key={feature.id}

                    map={mapRef.current}

                    feature={feature}

                />)

            })}
        </>
    )
```


Drag and zoom your map, and see the markers update after each fetch for new data.

With the Marker component rendering a default marker for each earthquake, you are ready to customize the markers.

# 6 Step

Customize the Markers

To customize the markers, you will expand the Marker component to use a custom HTML element instead of the default Mapbox GL JS marker.

The updated implementation of Marker will render a "badge" style div which contains the earthquake's magnitude data. React DOM's createPortal is used to render the div outside of the normal component hierarchy of your React app. More specifically, the div is rendered inside the Marker component's contentRef div, which is provided to the mapboxgl.Marker() instance as the marker's HTML content.

This approach allows you to build out the content of the marker using the normal react rendering process, including JSX and CSS styling.


### src/Marker.jsx

```JS
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

import { createPortal } from "react-dom";

const Marker = ({ map, feature }) => {
    const {
        geometry,

        properties
    } = feature

    const markerRef = useRef(null);

    const contentRef = useRef(document.createElement("div"));

    useEffect(() => {

        markerRef.current = new mapboxgl.Marker(contentRef.current)
            .setLngLat([geometry.coordinates[0], geometry.coordinates[1]])
            .addTo(map);

        return () => {
            markerRef.current.remove();
        };
    }, []);

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
As before, drag and zoom your map to trigger new data fetches and see the markers update with the new custom content.

