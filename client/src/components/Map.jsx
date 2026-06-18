import React, { useRef, useEffect } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import * as maptilerClient from "@maptiler/client";

export default function Map({ place }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const geoCodoing = async (place) => {
    maptilerClient.config.apiKey = import.meta.env.VITE_API_MAP_TILER;
    maptilersdk.config.apiKey = import.meta.env.VITE_API_MAP_TILER;

    const result = await maptilerClient.geocoding.forward(place);
    const [lon, lat] = result.features[0].geometry.coordinates;

    return { lon, lat };
  };

  const zoom = 14;

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once
    const initMap = async () => {
      const { lon, lat } = await geoCodoing(place);
      map.current = new maptilersdk.Map({
        container: mapContainer.current,
        style: "base-v4",
        center: [lon, lat],
        zoom: zoom,
      });
      new maptilersdk.Marker()
        .setLngLat([lon, lat]) // exact point
        .addTo(map.current);
    };
    initMap();
  }, [place, zoom]);

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}
