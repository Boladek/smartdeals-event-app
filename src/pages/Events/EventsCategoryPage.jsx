import { useMemo, useState } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import {
    useGetAllEvents,
    useGetEventByCategory,
} from "../../hooks/EventsHooks";
import { UpcomingEventCard, UpcomingEventSkeleton } from "./UpcomingEventCard";
import UpcomingEvents from "./UpcomingEvents";

const FILTER_TYPES = [
    { label: "Category", action: "eventCategory" },
    { label: "Event Type", action: "eventType" },
    { label: "Search", action: "search" },
    { label: "Date", action: "date" },
    { label: "Time", action: "time" },
    { label: "Location", action: "location" },
    { label: "Amount", action: "amount" },
];

const EventCard = ({ title, image, location }) => {
    const navigate = useNavigate();
    return (
        <div
            className="h-40 w-40 bg-gray-100 rounded-lg shadow-md overflow-hidden"
            onClick={() => navigate(title)}
        >
            <img src={image} alt={title} className="w-full h-32 object-cover" />
            <div className="p-4">
                <h3 className="font-semibold text-sm">{title}</h3>
                <p className="text-xs text-gray-600">{location}</p>
            </div>
        </div>
    );
};

const EventsCategoryPage = () => {
    const { category } = useParams();
    const [activeCategory, setActiveCategory] = useState("All");
    const { data: eventCategories = [], isLoading } =
        useGetEventByCategory(category);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState(null);

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
    };

    const handleFilterSelect = (option) => {
        setActiveFilter(option);
        setIsFilterOpen(false);
        // TODO: plug your actual filter logic here
        console.log("Selected filter:", option.action);
    };

    const allEventCategories = useMemo(
        () => eventCategories.map((event) => event.name),
        [eventCategories]
    );

    return (
        <div className="h-full space-y-8">
            {/* Search Bar */}
            <div className="flex justify-between gap-8">
                {/* <div className="flex items-center space-x-4 overflow-x-auto pb-3">
                    {isLoading ? (
                        // 🔹 Skeleton loader for category pills
                        <>
                            {Array.from({ length: 4 }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className="h-7 w-16 rounded-full bg-gray-200 animate-pulse"
                                />
                            ))}
                        </>
                    ) : (
                        ["All", ...allEventCategories].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className={`${
                                    activeCategory === cat
                                        ? "text-white bg-[#E41F26]"
                                        : "text-[#E41F26] bg-[#E41F260A]"
                                } text-xs font-semibold border-red-600 border rounded-full px-4 py-1 cursor-pointer transition ease-in-out duration-300 text-nowrap`}
                            >
                                {cat}
                            </button>
                        ))
                    )}
                </div> */}
                <div className="flex items-center gap-3">
                    {/* Filter button */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsFilterOpen((prev) => !prev)}
                            className="flex items-center justify-center h-9 w-9 rounded-full border border-gray-300 hover:bg-gray-100 text-gray-600"
                        >
                            <FaFilter className="text-xs" />
                        </button>

                        {isFilterOpen && (
                            <div className="absolute right-0 mt-2 w-44 rounded-md bg-white shadow-lg border border-gray-100 z-20">
                                <div className="py-1">
                                    {FILTER_TYPES.map((opt) => (
                                        <button
                                            key={opt.action}
                                            type="button"
                                            onClick={() =>
                                                handleFilterSelect(opt)
                                            }
                                            className={`block w-full text-left px-3 py-2 text-xs hover:bg-gray-100 ${
                                                activeFilter?.action ===
                                                opt.action
                                                    ? "text-[#E41F26] font-semibold"
                                                    : "text-gray-700"
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Search input */}
                    <div className="relative w-full max-w-[200px] border-b">
                        <input
                            type="text"
                            placeholder="Search events"
                            className="w-full p-2 pl-10 text-xs border-gray-300 focus:outline-none"
                        />
                        <FaSearch className="absolute left-3 top-4 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Event Sections */}
            {/* <div className="space-y-8">
                
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <h2 className="text-[14px] font-semibold text-gray-800">
                            Nearby You
                        </h2>
                        <button className="text-[#FA6400] text-[12px] cursor-pointer">
                            See all
                        </button>
                    </div>
                    <div className="flex gap-6">
                        <EventCard
                            title="2023 Experience"
                            image="/path/to/image1.jpg"
                            location="Lagos, Nigeria"
                        />
                        <EventCard
                            title="Saturday Party"
                            image="/path/to/image2.jpg"
                            location="Abuja, Nigeria"
                        />
                        <EventCard
                            title="2023 Experience"
                            image="/path/to/image3.jpg"
                            location="Lagos, Nigeria"
                        />
                        <EventCard
                            title="Saturday Party"
                            image="/path/to/image4.jpg"
                            location="Abuja, Nigeria"
                        />
                    </div>
                </div>

                
            </div> */}
            <div>
                <UpcomingEvents />
            </div>
        </div>
    );
};

export default EventsCategoryPage;
