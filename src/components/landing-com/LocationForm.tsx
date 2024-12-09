"use client";

import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

type Library = 'places' | 'drawing' | 'geometry' | 'visualization'; 

interface LocationFormProps {
  onLocationChange: (location: { businessAddress: string; lat: number; lng: number }) => void;
}

const libraries: Library[] = ['places'];

const LocationForm: React.FC<LocationFormProps> = ({ onLocationChange }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [coordinates, setCoordinates] = useState({ lat: -5.147665, lng: 119.432731 });
  const [businessAddress, setBusinessAddress] = useState("");
  const autocompleteRef = useRef<any>(null); // Ref untuk autocomplete input
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(inputRef.current);
      autocomplete.setFields(['address_components', 'geometry']);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          setCoordinates({ lat, lng });
          setBusinessAddress(place.formatted_address || "");
          onLocationChange({ businessAddress: place.formatted_address || "", lat, lng });
        } else {
          console.error("No geometry or location found for this place");
        }
      });
    }
  }, [isLoaded]);

  const handleDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setCoordinates({ lat, lng });
  
      // Gunakan Geocoder untuk mendapatkan alamat berdasarkan koordinat marker
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: e.latLng }, (results, status) => {
        if (status === "OK" && results?.[0]?.formatted_address) {
          const address = results[0].formatted_address;
          setBusinessAddress(address);
          onLocationChange({ businessAddress: address, lat, lng });
        } else {
          console.error("Geocode was not successful for the following reason:", status);
          setError("Failed to retrieve address from the location.");
        }
      });
    }
  };
  

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setBusinessAddress(newAddress);

    // Gunakan Geocoder untuk mendapatkan koordinat dari alamat yang diinput
    if (newAddress) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: newAddress }, (results, status) => {
        if (status === "OK" && results?.[0]?.geometry?.location) {
          const location = results[0].geometry.location;
          setCoordinates({ lat: location.lat(), lng: location.lng() });
          onLocationChange({
            businessAddress: newAddress,
            lat: location.lat(),
            lng: location.lng(),
          });
        }
      });
    }
  };

  if (loadError) {
    return <p>Error loading Google Maps</p>;
  }

  if (!isLoaded) {
    return <p>Loading Google Maps...</p>;
  }

  return (
    <div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Business Address</label>
        <input
          ref={inputRef}
          type="text"
          value={businessAddress}
          onChange={handleAddressChange} // Pembaruan manual input
          placeholder="Enter your business address"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A4635]"
        />
      </div>

      <GoogleMap
        center={coordinates}
        zoom={13}
        mapContainerStyle={{ width: "100%", height: "400px" }}
      >
        <Marker
          position={coordinates}
          draggable
          onDragEnd={handleDragEnd} // Pembaruan saat marker dipindah
        />
      </GoogleMap>
    </div>
  );
};

export default LocationForm;
function setError(arg0: string) {
  throw new Error("Function not implemented.");
}

