import { useMemo, useState, useEffect } from "react";
import { useGetMyEvents } from "../../hooks/UserEventHooks";
import {
    UpcomingEventCard,
    UpcomingEventSkeleton,
} from "../Events/UpcomingEventCard";

const TABS = ["All", "Active", "Closed", "Pending"];

const normalize = (v) => (v == null ? "" : String(v).toLowerCase().trim());

const matchesSearch = (event, term) => {
    if (!term) return true;

    const haystack = [
        event.eventName,
        event.slogan,
        event.venue,
        event.eventCategory,
        event.eventType,
        event.eventZone,
        event.eventClass,
        event.address,
        event.state,
        event.country,
    ]
        .map(normalize)
        .join(" ");

    return haystack.includes(term);
};

const matchesTab = (event, tab) => {
    if (tab === "All") return true;
    return normalize(event.status) === normalize(tab);
};

// tiny debounce hook (no libs)
const useDebounce = (value, delay = 350) => {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);

    return debounced;
};

function PostedEventsPage() {
    const [selectedTab, setSelectedTab] = useState("All");
    const [search, setSearch] = useState("");

    const debouncedSearch = useDebounce(search, 350);

    const [page, setPage] = useState(0);
    const [direction, setDirection] = useState("next");

    const { data: allEvents = {}, isLoading: gettingAllEvents } =
        useGetMyEvents({
            page,
            direction,
        });

    // Reset pagination when filters change (good UX)
    useEffect(() => {
        setPage(0);
        setDirection("next");
    }, [selectedTab, debouncedSearch]);

    const filteredEvents = useMemo(() => {
        const list = allEvents?.data ?? [];
        const term = normalize(debouncedSearch);

        return list.filter(
            (ev) => matchesTab(ev, selectedTab) && matchesSearch(ev, term)
        );
    }, [allEvents?.data, selectedTab, debouncedSearch]);

    const handleNextPage = () => {
        if (allEvents.hasNextPage) {
            setPage(allEvents.pageForward);
            setDirection("next");
        }
    };

    const handlePreviousPage = () => {
        if (allEvents.hasPreviousPage) {
            setPage(allEvents.pageBack);
            setDirection("previous");
        }
    };

    return (
        <div>
            <div className="mb-5 pt-3 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-6">
                {/* 🔍 Search (full-width on mobile) */}
                <div className="w-full md:flex-1">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        type="text"
                        placeholder="Search Events"
                        className="
                w-full p-3 rounded-2xl
                bg-gray-100 text-gray-700 placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-primary
            "
                    />
                </div>

                {/* 🧭 Tabs */}
                <div className="w-full md:w-auto border-b border-gray-100">
                    <div className="flex gap-8 items-center overflow-x-auto no-scrollbar">
                        {TABS.map((tab) => {
                            const active = selectedTab === tab;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setSelectedTab(tab)}
                                    className={[
                                        "relative pb-3 whitespace-nowrap text-sm font-semibold transition-colors",
                                        active
                                            ? "text-primary"
                                            : "text-gray-500 hover:text-gray-800",
                                    ].join(" ")}
                                >
                                    {tab}
                                    {active && (
                                        <span className="absolute left-0 -bottom-[1px] h-[2px] w-full bg-primary rounded-full" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {gettingAllEvents ? (
                    Array.from({ length: 4 }).map((_, idx) => (
                        <UpcomingEventSkeleton key={idx} />
                    ))
                ) : filteredEvents.length === 0 ? (
                    <div className="col-span-full rounded-2xl border border-gray-100 bg-white p-6 text-center">
                        <p className="text-sm font-semibold text-gray-900">
                            No events found
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                            Try a different search or tab.
                        </p>
                    </div>
                ) : (
                    filteredEvents.map((event) => (
                        <UpcomingEventCard
                            event={event}
                            key={event.id}
                            link="/events-details"
                        />
                    ))
                )}
            </div>

            {/* Pagination */}
            {(allEvents?.data?.length ?? 0) > 0 && (
                <div className="flex justify-between mt-6 pb-4">
                    <button
                        className="text-sm text-primary hover:bg-gray-100 py-2 px-6 rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-primary/50
                       disabled:opacity-50 disabled:cursor-not-allowed border border-primary/20"
                        onClick={handlePreviousPage}
                        disabled={!allEvents.hasPreviousPage}
                    >
                        Previous
                    </button>

                    <button
                        className="text-sm text-white bg-primary hover:bg-primary/80 py-2 px-6 rounded-xl
                       focus:outline-none focus:ring-2 focus:ring-primary/50
                       disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleNextPage}
                        disabled={!allEvents.hasNextPage}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default PostedEventsPage;
