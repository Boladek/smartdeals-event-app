import React from "react";
import {
    FaCalendarAlt,
    FaCalendar,
    FaClock,
    FaBuilding,
    FaTags,
    FaDesktop,
    FaImage,
} from "react-icons/fa";

const EventDetails = ({ data }) => {
    const { banners } = data;

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-600" />
                    <p className="font-semibold text-gray-800">Event Name:</p>
                    <p className="text-gray-600">{data.eventName}</p>
                </div>
                <div className="flex items-center gap-2">
                    <FaTags className="text-gray-600" />
                    <p className="font-semibold text-gray-800">Description:</p>
                    <p className="text-gray-600">{data.description}</p>
                </div>
                <div className="flex items-center gap-2">
                    <FaCalendar className="text-gray-600" />
                    <p className="font-semibold text-gray-800">Event Date:</p>
                    <p className="text-gray-600">{data.eventDate}</p>
                </div>
                <div className="flex items-center gap-2">
                    <FaClock className="text-gray-600" />
                    <p className="font-semibold text-gray-800">Event Time:</p>
                    <p className="text-gray-600">{data.eventTime}</p>
                </div>
                <div className="flex items-center gap-2">
                    <FaBuilding className="text-gray-600" />
                    <p className="font-semibold text-gray-800">Venue:</p>
                    <p className="text-gray-600">{data.venue}</p>
                </div>
                <div className="flex items-center gap-2">
                    <FaBuilding className="text-gray-600" />
                    <p className="font-semibold text-gray-800">Address:</p>
                    <p className="text-gray-600">{data.address}</p>
                </div>
                <div className="flex items-center gap-2">
                    <FaTags className="text-gray-600" />
                    <p className="font-semibold text-gray-800">
                        Event Category:
                    </p>
                    <p className="text-gray-600">{data.eventCategory}</p>
                </div>
                <div className="flex items-center gap-2">
                    <FaDesktop className="text-gray-600" />
                    <p className="font-semibold text-gray-800">Event Type:</p>
                    <p className="text-gray-600">{data.eventType}</p>
                </div>
            </div>

            {/* Banners Section */}
            <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800">Banners</h4>
                {banners && banners.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {banners
                            .filter((item) => item)
                            .map((banner, index) => (
                                <div
                                    key={index}
                                    className="w-full bg-gray-100 p-4 rounded-lg border border-gray-300 shadow-md flex flex-col items-center"
                                >
                                    <div className="relative w-full h-48 bg-gray-200 rounded-lg flex justify-center items-center">
                                        {banner ? (
                                            <img
                                                src={banner}
                                                alt={`Banner ${index + 1}`}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                No Image Uploaded
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-xs text-center text-gray-500 mt-2">
                                        Banner {index + 1}
                                    </p>
                                </div>
                            ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">
                        No banners uploaded yet.
                    </p>
                )}
            </div>
        </div>
    );
};

export default EventDetails;
