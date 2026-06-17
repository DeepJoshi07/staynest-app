import "@maptiler/sdk/dist/maptiler-sdk.css";
import { Map, MapStyle, config } from '@maptiler/sdk';

config.apiKey = import.meta.env.VITE_API_MAP_TILER;
const map = new Map({
    container: 'map', // container's id or the HTML element in which SDK will render the map
    style: MapStyle.STREETS,
    center: [16.62662018, 49.2125578], // starting position [lng, lat]
    zoom: 14 // starting zoom
});