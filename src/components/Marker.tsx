import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { createPortal } from "react-dom";

// Define types for the props
interface MarkerProps {
  map: mapboxgl.Map;
  feature: {
    id: string;
    geometry: {
      coordinates: [number, number];
    };
    properties: {
      mag: number;
    };
  };
  isActive?: boolean;
  onClick?: (feature: any) => void;
}

const Marker = ({ map, feature, isActive = false, onClick }: MarkerProps) => {
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
          onClick={() => onClick?.(feature)}
          style={{
            display: "inline-block",
            padding: "2px 10px",
            borderRadius: "50px",
            backgroundColor: isActive ? "#333" : "#fff",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            fontWeight: "bold",
            color: isActive ? "#fff" : "#333",
            textAlign: "center",
            cursor: "pointer",
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
