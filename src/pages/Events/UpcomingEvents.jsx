import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useGetAllEvents, useGetFilteredEvents } from "../../hooks/EventsHooks";
import { UpcomingEventCard, UpcomingEventSkeleton } from "./UpcomingEventCard";
import { EventActions } from "../../components/EventActions";
import { FaFilter, FaRedoAlt, FaRegCalendarTimes } from "react-icons/fa";

const DEFAULT_EXTRA_PARAMS = {
    action: "search",
    keyword: "all",
};

export default function UpcomingEvents() {
    const [open, setOpen] = useState(false);
    const [extraParams, setExtraparams] = useState(DEFAULT_EXTRA_PARAMS);

    // ✅ URL params
    const [searchParams, setSearchParams] = useSearchParams();

    const page = useMemo(() => {
        const raw = searchParams.get("page");
        const n = raw ? Number(raw) : 0;
        return Number.isFinite(n) && n >= 0 ? n : 0;
    }, [searchParams]);

    const direction = useMemo(() => {
        const d = searchParams.get("dir");
        return d === "previous" ? "previous" : "next";
    }, [searchParams]);

    const { data: allEvents = [], isLoading: gettingAllEvents } =
        useGetAllEvents({ page, direction });

    const { data: filters = [], isLoading: gettingAllFilters } =
        useGetFilteredEvents({ page, direction, ...extraParams });

    const updateParams = (nextPage, nextDir) => {
        setSearchParams((prev) => {
            const p = new URLSearchParams(prev);
            p.set("page", String(nextPage));
            p.set("dir", nextDir);
            return p;
        });
    };

    const handleNextPage = () => {
        if (filters?.hasNextPage) {
            updateParams(filters.pageForward, "next");
        }
    };

    const handlePreviousPage = () => {
        if (filters?.hasPreviousPage) {
            updateParams(filters.pageBack, "previous");
        }
    };

    // ✅ refresh/reset
    const handleRefresh = () => {
        setExtraparams(DEFAULT_EXTRA_PARAMS);
        updateParams(0, "next");
    };

    const isLoading = gettingAllEvents || gettingAllFilters;
    const events = filters?.data ?? [];
    const hasEvents = events.length > 0;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-[14px] font-semibold text-gray-800">
                    Events
                </h2>

                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    className="flex items-center justify-center h-9 w-9 rounded-full border border-gray-300 hover:bg-gray-100 text-gray-600"
                    title="Filter"
                >
                    <FaFilter className="text-xs" />
                </button>
            </div>

            {/* ✅ Grid / Skeleton / Empty state */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                    {Array.from({ length: 8 }).map((_, idx) => (
                        <UpcomingEventSkeleton key={idx} />
                    ))}
                </div>
            ) : hasEvents ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                    {events.map((event) => (
                        <UpcomingEventCard
                            event={event}
                            key={event.id}
                            link={`/dashboard/${event.eventId}/${event.eventClass}`}
                        />
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                        <FaRegCalendarTimes
                            className="text-primary"
                            size={22}
                        />
                    </div>

                    <h3 className="mt-4 text-sm sm:text-base font-semibold text-gray-900">
                        No events found
                    </h3>

                    <p className="mt-1 text-xs sm:text-sm text-gray-600">
                        Try changing your filters or refresh to see all events.
                    </p>

                    <div className="mt-5 flex flex-col sm:flex-row gap-2 justify-center">
                        <button
                            type="button"
                            onClick={() => setOpen(true)}
                            className="w-full sm:w-auto px-5 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Adjust Filters
                        </button>

                        <button
                            type="button"
                            onClick={handleRefresh}
                            className="w-full sm:w-auto px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 inline-flex items-center justify-center gap-2"
                        >
                            <FaRedoAlt />
                            Refresh
                        </button>
                    </div>
                </div>
            )}

            {/* ✅ Pagination */}
            {hasEvents && (
                <div className="flex justify-between mt-4 pb-4">
                    <button
                        className="text-sm text-primary hover:bg-gray-100 py-2 px-6 rounded-lg focus:outline-primary/90 focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed outline-2 outline-primary"
                        onClick={handlePreviousPage}
                        disabled={!filters?.hasPreviousPage}
                    >
                        Previous
                    </button>

                    <button
                        className="text-sm text-white bg-primary hover:bg-primary/80 py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleNextPage}
                        disabled={!filters?.hasNextPage}
                    >
                        Next
                    </button>
                </div>
            )}

            {open && (
                <EventActions
                    handleClose={() => setOpen(false)}
                    clearAction={() => setExtraparams(DEFAULT_EXTRA_PARAMS)}
                    handleAction={(arg) => {
                        setExtraparams(arg);
                        updateParams(0, "next"); // ✅ reset pagination when applying new filter
                    }}
                />
            )}
        </div>
    );
}
