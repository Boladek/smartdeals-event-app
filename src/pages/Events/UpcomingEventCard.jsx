import React from "react";
import { FiHeart, FiMapPin, FiTag, FiCreditCard } from "react-icons/fi";
import { useNavigate } from "react-router";
import { UseAuth } from "../../contexts/AuthContext";

export function UpcomingEventCard({ event, link = "" }) {
    if (!link) {
        link = `/dashboard/${event.eventId}/${event.eventClass}`;
    }
    const { isLoggedIn } = UseAuth();
    const navigate = useNavigate();
    const image = event?.image1 || "/images/event-placeholder.jpg";

    const isPaid = event.eventType === "Paid";

    return (
        <div
            className="relative col-span-1 h-56 sm:h-64 overflow-hidden rounded-[24px] bg-slate-900 shadow-md cursor-pointer"
            onClick={() => {
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

            {/* ================= TOP ROW ================= */}
            <div className="absolute left-5 right-5 top-4 flex items-start justify-between">
                {/* Title */}
                <div className="flex items-center gap-3">
                    <span className="h-4 w-4 rounded-full bg-pink-300" />
                    <h3 className="text-sm font-semibold text-white line-clamp-1">
                        {event?.eventName || "2023 Experience XII"}
                    </h3>
                </div>

                {/* Paid / Free badge */}
                <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold backdrop-blur-sm
                        ${
                            isPaid
                                ? "bg-red-400/90 text-white"
                                : "bg-green-500/90 text-white"
                        }
                    `}
                    title={isPaid ? "Paid Event" : "Free Event"}
                >
                    {isPaid ? (
                        <>
                            <FiCreditCard size={12} />
                            Paid
                        </>
                    ) : (
                        <>
                            <FiTag size={12} />
                            Free
                        </>
                    )}
                </span>
            </div>

            {/* ================= BOTTOM INFO ================= */}
            <div className="absolute bottom-6 left-6 right-16 space-y-1">
                <div className="mt-1 flex items-center gap-2 text-sm text-white">
                    {/* Decorative dots */}

                    {/* Location */}

                    <span className="flex gap-1 text-xs font-semibold text-white">
                        <FiMapPin className="text-red-400" size={16} />
                        <span className="line-clamp-1">
                            {event?.venue || "Lagos"},{" "}
                            {event?.country || "Nigeria"}
                        </span>
                    </span>
                </div>
            </div>

            {/* ================= LIKE BUTTON (BOTTOM RIGHT) ================= */}
            {isLoggedIn && false && (
                <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:scale-105 transition"
                    title="Add to favourites"
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
    );
}

/* ================= SKELETON ================= */

export const UpcomingEventSkeleton = () => {
    return (
        <div className="relative col-span-1 h-56 sm:h-64 overflow-hidden rounded-[24px] bg-gray-200 animate-pulse">
            <div className="absolute inset-0 bg-gray-300" />

            <div className="absolute left-5 right-5 top-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="h-8 w-8 rounded-full bg-gray-400" />
                    <div className="h-4 w-40 bg-gray-400 rounded" />
                </div>
                <span className="h-6 w-16 rounded-full bg-gray-400" />
            </div>

            <div className="absolute bottom-6 left-6 right-6 space-y-2">
                <div className="h-3 w-32 bg-gray-400 rounded" />
                <div className="h-3 w-48 bg-gray-300 rounded" />
            </div>
        </div>
    );
};
