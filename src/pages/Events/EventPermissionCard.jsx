import { useState, useEffect } from "react";
import EnableLocationHook from "../../hooks/EnableLocationHook";

export const EventPermissionCard = () => {
    const { error, handleAllow, handleDeny, location } = EnableLocationHook();

    return (
        <div className="max-w-lg mx-auto space-y-6">
            {/* Title */}
            <h2 className="text-3xl font-semibold text-center">
                Explore upcoming & Nearby events
            </h2>

            {/* Description */}
            <p className="text-center text-gray-600">
                Allow SmartDeal to access your location while using the app
            </p>

            {/* Button Section */}
            <div className="flex justify-center space-x-4">
                {/* Allow Button */}
                <button
                    onClick={handleAllow}
                    className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-all"
                >
                    Allow
                </button>

                {/* Don't Allow Button */}
                <button
                    onClick={handleDeny}
                    className="px-6 py-2 border-2 border-gray-400 text-gray-600 font-semibold rounded-md hover:bg-gray-200 transition-all"
                >
                    Don’t Allow
                </button>
            </div>

            {/* Location info or error */}
            {location && (
                <div className="text-center text-green-600">
                    <p>
                        Location:{" "}
                        {`Latitude: ${location.latitude}, Longitude: ${location.longitude}`}
                    </p>
                </div>
            )}

            {error && (
                <div className="text-center text-red-600">
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};
