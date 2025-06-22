# Mapbox React Tutorial: Add Dynamic Markers to a Map

## Configure camera
Before setting up data fetching, configure your map's camera settings to make sure the map is zoomed in on an area that will include earthquakes for the given date range. Set the center and zoom options to focus on an earthquake-prone area such as Indonesia to make sure that markers will be visible in the initial view. Setting minZoom to 5.5 will prevent the user from zooming out past the initial view, which keeps the bounding boxes smaller to avoid responses with hundreds or even thousands of earthquakes.

Mapbox provides the handy Location Helper tool to help you get center and zoom values when setting up a map. You can use it to find coordinates for a specific location if you want to try loading data for another part of the world.

Add options in the Map component to set the initial view.
src/Map.jsx

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

## Add markers to the map

Now that you have the data, you can add markers to the map.

