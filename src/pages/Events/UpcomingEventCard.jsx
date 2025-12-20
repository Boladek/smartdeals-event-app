import React from "react";
import { FiHeart, FiMapPin } from "react-icons/fi";
import { useNavigate } from "react-router";
import { UseAuth } from "../../contexts/AuthContext";

export function UpcomingEventCard({ event, link = "/dashboard/details" }) {
    const { isLoggedIn } = UseAuth();
    const navigate = useNavigate();
    const image = event?.image1 || "/images/event-placeholder.jpg";

    return (
        <div
            className="relative col-span-1 h-56 sm:h-64 overflow-hidden rounded-[24px] bg-slate-900 shadow-md"
            onClick={() => {
                // TODO: handle navigation or show details
                // console.log("Clicked event:", event.id);
                navigate(link, {
                    state: { event },
                });
            }}
        >
            {/* Background image */}
            <img
                src={image}
                alt={event?.eventName || "Event banner"}
                className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />

            {/* Top row: dot + title */}
            <div className="absolute left-5 right-5 top-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-full bg-pink-300" />

                    <h3 className="text-base sm:text-lg font-semibold text-white">
                        {event?.eventName || "2023 Experience XII"}
                    </h3>
                </div>

                {/* Favourite button */}
                {isLoggedIn && (
                    <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm"
                    >
                        <FiHeart
                            className={
                                event?.is_favorite
                                    ? "fill-red-500 text-red-500"
                                    : "text-red-500"
                            }
                            size={20}
                        />
                    </button>
                )}
            </div>

            {/* Bottom-left content */}
            <div className="absolute bottom-6 left-6 right-6 space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                    {event?.slogan || "Music Party"}
                </p>

                <div className="mt-1 flex items-center gap-2 text-sm text-white">
                    {/* small fading dots */}
                    <span className="flex items-center gap-1">
                        <span className="h-1 w-1 rounded-full bg-white/70" />
                        <span className="h-1 w-1 rounded-full bg-white/60" />
                        <span className="h-1 w-1 rounded-full bg-white/50" />
                    </span>

                    <span className="flex items-center gap-1">
                        <FiMapPin className="text-red-400" size={16} />
                        <span>
                            {event?.venue || "Lagos"},{" "}
                            {event?.country || "Nigeria"}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
}

export const UpcomingEventSkeleton = () => {
    return (
        <div className="relative col-span-1 h-56 sm:h-64 overflow-hidden rounded-[24px] bg-gray-200 animate-pulse">
            {/* fake image / background */}
            <div className="absolute inset-0 bg-gray-300" />

            {/* top row placeholder */}
            <div className="absolute left-5 right-5 top-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-full bg-gray-400" />
                    <div className="h-4 w-40 bg-gray-400 rounded" />
                </div>
                <span className="h-10 w-10 rounded-full bg-gray-400" />
            </div>

            {/* bottom-left placeholder */}
            <div className="absolute bottom-6 left-6 right-6 space-y-2">
                <div className="h-3 w-32 bg-gray-400 rounded" />
                <div className="h-3 w-48 bg-gray-300 rounded" />
            </div>
        </div>
    );
};
