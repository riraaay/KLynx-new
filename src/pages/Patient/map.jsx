import { useRef, useEffect } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './map.css';

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const tokyo = { lng: 121.106651, lat: 14.607532 };
  const zoom = 18;
  maptilersdk.config.apiKey = 'zKdOhGfQaGxspXOXk97Z';

  // Raw data for diseases, locations, and street names
  const rawData = [
    { coordinates: [121.104905, 14.608677], street: 'Street A', disease: 'Dengue Fever' },
    { coordinates: [121.104905, 14.608677], street: 'Street A', disease: 'Malaria' },
    { coordinates: [121.108935, 14.609167], street: 'Street B', disease: 'Malaria' },
    { coordinates: [121.107084, 14.607047], street: 'Street C', disease: 'COVID-19' },
    { coordinates: [121.107084, 14.607047], street: 'Street C', disease: 'Dengue Fever' },
    { coordinates: [121.107084, 14.607047], street: 'Street C', disease: 'Dengue Fever' }
  ];

  // Aggregate data by coordinates and diseases
  const aggregatedData = {};
  rawData.forEach((entry) => {
    const coordKey = entry.coordinates.join(',');
    if (!aggregatedData[coordKey]) {
      aggregatedData[coordKey] = { street: entry.street, diseases: {} };
    }
    if (!aggregatedData[coordKey].diseases[entry.disease]) {
      aggregatedData[coordKey].diseases[entry.disease] = 0;
    }
    aggregatedData[coordKey].diseases[entry.disease]++;
  });

  // Transform aggregated data into GeoJSON format
  const pointData = {
    type: 'FeatureCollection',
    features: Object.entries(aggregatedData).map(([coordKey, data]) => {
      const [lng, lat] = coordKey.split(',').map(Number);
      const diseaseDescriptions = Object.entries(data.diseases)
        .map(([disease, count]) => `<b>${disease}:</b> ${count} case(s)`)
        .join('<br>');

      const description = `<b>Street:</b> ${data.street}<br>${diseaseDescriptions}`;



      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lng, lat] },
        properties: { description }
      };
    })
  };

  const coordinates = [
    [121.11552115094781, 14.621334515758065],
    [121.10189747271977, 14.615926874899571],
    [121.10836928091186, 14.602592150062776],
    [121.12379196608924, 14.610632136662232],
    [121.11548344882164, 14.62128466589428]
  ];

  const worldPolygon = [
    [
      [-180, -90],
      [180, -90],
      [180, 90],
      [-180, 90],
      [-180, -90]
    ]
  ];

  // Create an inverted polygon by subtracting the area inside the polygon
  const invertedPolygon = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            worldPolygon[0],
            coordinates
          ]
        }
      }
    ]
  };

  useEffect(() => {
    if (map.current) return; // stops map from initializing more than once

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [tokyo.lng, tokyo.lat],
      zoom: zoom
    });

    // Add GeoJSON data for disease locations
    map.current.on('load', () => {
      // Add the GeoJSON source
      map.current.addSource('points', {
        type: 'geojson',
        data: pointData
      });

      // Add a circle layer for the points
      map.current.addLayer({
        id: 'point-layer',
        type: 'circle',
        source: 'points',
        paint: {
          'circle-radius': 8,
          'circle-color': '#FF5733',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#000000'
        }
      });

      // Add a popup on point click
      const popup = new maptilersdk.Popup();
      map.current.on('click', 'point-layer', (e) => {
        const description = e.features[0].properties.description;
        popup
          .setLngLat(e.lngLat)
          .setHTML(`<div className="map-popup">${description}</div>`)
          .addTo(map.current);
      });

      // Change cursor to pointer on hover
      map.current.on('mouseenter', 'point-layer', () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });

      // Reset cursor when not hovering
      map.current.on('mouseleave', 'point-layer', () => {
        map.current.getCanvas().style.cursor = '';
      });

      // Add the inverted polygon as a GeoJSON source
      map.current.addSource('inverted-polygon', {
        type: 'geojson',
        data: invertedPolygon
      });

      // Add a layer to render the inverted polygon
      map.current.addLayer({
        id: 'inverted-polygon-layer',
        type: 'fill',
        source: 'inverted-polygon',
        paint: {
          'fill-color': '#FF0000',
          'fill-opacity': 0.5
        }
      });
    });
  }, [tokyo.lng, tokyo.lat, zoom]); // dependencies to rerun effect if any of these values change

  return (

    <div className="map-wrap">
      <div ref={mapContainer} className="gmap" />
    </div>
  );
}
