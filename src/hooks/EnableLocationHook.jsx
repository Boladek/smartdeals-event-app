import { useCallback, useEffect, useState } from "react";
import { getGeolocation } from "../helpers/functions";

function useEnableLocation() {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [permission, setPermission] = useState("prompt");

    // ---- CHECK REAL BROWSER PERMISSION ----
    useEffect(() => {
        if (!navigator.permissions) return;

        navigator.permissions.query({ name: "geolocation" }).then((result) => {
            setPermission(result.state);

            if (result.state === "granted") {
                // Automatically get location if permission was already granted
                getGeolocation(
                    (coords) => {
                        setLocation(coords);
                        setError(null);
                    },
                    (err) => setError(err)
                );
            }

            if (result.state === "denied") {
                setError("Location access denied.");
            }

            // Listen for changes (user changes browser setting)
            result.onchange = () => setPermission(result.state);
        });
    }, []);

    // ---- ASK USER FOR PERMISSION ----
    const handleAllow = useCallback(() => {
        navigator?.geolocation?.getCurrentPosition(
            (position) => {
                setLocation(position.coords);
                setPermission("granted");
                setError(null);
            },
            () => {
                setPermission("denied");
                setError("Unable to retrieve your location.");
            },
            { maximumAge: 1000 * 60 * 5, enableHighAccuracy: true }
        );
    }, []);

    const handleDeny = useCallback(() => {
        setPermission("denied");
        setError("Location access denied.");
    }, []);

    return { handleAllow, handleDeny, error, location, permission };
}

export default useEnableLocation;
