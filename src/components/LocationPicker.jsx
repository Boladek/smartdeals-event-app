import { useEffect, useRef, useState } from "react";
import {
    GoogleMap,
    MarkerF,
    Autocomplete,
    useLoadScript,
} from "@react-google-maps/api";
import { Controller } from "react-hook-form";
import { BaseInput } from "./BaseInput";

const libraries = ["places"];

const containerStyle = {
    width: "100%",
    height: "260px",
};

const defaultCenter = { lat: 6.5244, lng: 3.3792 }; // Lagos default

export const LocationPicker = ({
    control,
    setValue,
    errors,
    addressName = "address",
    latName = "latitude",
    lngName = "longitude",
    label = "Business Address",
    addressValue,
    latValue,
    lngValue,
}) => {
    const [markerPosition, setMarkerPosition] = useState(null);
    const autocompleteRef = useRef(null);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    // Initialise marker from form lat/lng when available
    useEffect(() => {
        if (
            latValue !== undefined &&
            latValue !== null &&
            lngValue !== undefined &&
            lngValue !== null &&
            latValue !== "" &&
            lngValue !== ""
        ) {
            const latNum = Number(latValue);
            const lngNum = Number(lngValue);
            if (!isNaN(latNum) && !isNaN(lngNum)) {
                setMarkerPosition({ lat: latNum, lng: lngNum });
            }
        }
    }, [latValue, lngValue]);

    const updateFormCoords = (lat, lng) => {
        setValue(latName, lat);
        setValue(lngName, lng);
    };

    const reverseGeocode = (lat, lng) => {
        if (!window.google || !window.google.maps) return;

        const geocoder = new window.google.maps.Geocoder();
        const location = { lat, lng };

        geocoder.geocode({ location }, (results, status) => {
            if (status === "OK" && results && results[0]) {
                const formatted = results[0].formatted_address;
                setValue(addressName, formatted);
            }
        });
    };

    const handleMapClick = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarkerPosition({ lat, lng });
        updateFormCoords(lat, lng);
        reverseGeocode(lat, lng);
    };

    const handleMarkerDragEnd = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarkerPosition({ lat, lng });
        updateFormCoords(lat, lng);
        reverseGeocode(lat, lng);
    };

    const handlePlaceChanged = () => {
        if (!autocompleteRef.current) return;

        const place = autocompleteRef.current.getPlace();
        if (!place || !place.geometry) return;

        const formatted = place.formatted_address;
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        setValue(addressName, formatted);
        updateFormCoords(lat, lng);
        setMarkerPosition({ lat, lng });
    };

    if (!isLoaded) {
        return (
            <BaseInput label={label} placeholder="Loading map..." disabled />
        );
    }

    const center = markerPosition || defaultCenter;

    return (
        <div className="w-full space-y-2">
            {/* Address input + Autocomplete */}
            <Controller
                name={addressName}
                control={control}
                rules={{ required: "Address is required" }}
                render={({ field }) => (
                    <Autocomplete
                        onLoad={(autocomplete) =>
                            (autocompleteRef.current = autocomplete)
                        }
                        onPlaceChanged={handlePlaceChanged}
                    >
                        <BaseInput
                            label={label}
                            {...field}
                            placeholder="Start typing your address or pick on the map..."
                            error={errors[addressName]}
                            errorText={errors[addressName]?.message}
                        />
                    </Autocomplete>
                )}
            />

            {/* Map */}
            <div className="border border-[#D0D5DD] rounded-md overflow-hidden">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={15}
                    onClick={handleMapClick}
                >
                    {markerPosition && (
                        <MarkerF
                            position={markerPosition}
                            draggable
                            onDragEnd={handleMarkerDragEnd}
                        />
                    )}
                </GoogleMap>
            </div>

            <p className="text-[11px] text-gray-500">
                You can type and select your address from the dropdown, or
                click/drag on the map to set your exact location.
            </p>
        </div>
    );
};
