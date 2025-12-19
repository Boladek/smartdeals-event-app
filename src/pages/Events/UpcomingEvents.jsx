import { useState } from "react";
import { useNavigate } from "react-router";
import { useGetAllEvents } from "../../hooks/EventsHooks";
import { UpcomingEventCard, UpcomingEventSkeleton } from "./UpcomingEventCard";
import { SideDrawer } from "../../components/SideDrawer";
import { formatEventDate } from "../../helpers/functions";

function UpcomingEvents() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(0); // Initial page state
    const [direction, setDirection] = useState("next");

    const { data: allEvents = [], isLoading: gettingAllEvents } =
        useGetAllEvents({ page, direction }); // Fetch events with pagination

    const handleNextPage = () => {
        if (allEvents.hasNextPage) {
            setPage(allEvents.pageForward); // Move to the next page
            setDirection("next");
        }
    };

    const handlePreviousPage = () => {
        if (allEvents.hasPreviousPage) {
            setPage(allEvents.pageBack); // Move to the previous page
            setDirection("previous");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <h2 className="text-[14px] font-semibold text-gray-800">
                    Upcoming Events
                </h2>
                <button
                    className="text-[#FA6400] text-[12px] cursor-pointer"
                    onClick={() => setOpen(true)}
                >
                    See all
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {gettingAllEvents
                    ? Array.from({ length: 4 }).map((_, idx) => (
                          <UpcomingEventSkeleton key={idx} />
                      ))
                    : allEvents.data?.map((event) => (
                          <UpcomingEventCard
                              event={event}
                              key={event.id}
                              link="/dashboard/details"
                          />
                      ))}
            </div>

            {allEvents.data?.length > 0 && (
                <div className="flex justify-between mt-4 pb-4">
                    <button
                        className="text-sm text-primary hover:bg-gray-100 py-2 px-6 rounded-lg focus:outline-primary/90 focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed outline-2 outline-primary"
                        onClick={handlePreviousPage}
                        disabled={!allEvents.hasPreviousPage}
                    >
                        Previous
                    </button>
                    <button
                        className="text-sm text-white bg-primary hover:bg-primary/80 py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleNextPage}
                        disabled={!allEvents.hasNextPage}
                    >
                        Next
                    </button>
                </div>
            )}

            {open && (
                <SideDrawer
                    handleClose={() => setOpen(false)}
                    title="Upcoming Events"
                    width={500}
                >
                    <div className="space-y-3">
                        {gettingAllEvents ? (
                            Array.from({ length: 6 }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className="w-full h-20 rounded-lg bg-gray-100 animate-pulse"
                                />
                            ))
                        ) : allEvents.data?.length === 0 ? (
                            <p className="text-sm text-gray-500">
                                No events found.
                            </p>
                        ) : (
                            allEvents.data.map((event) => (
                                <EventListItem
                                    key={event.id}
                                    event={event}
                                    onClick={() => {
                                        // TODO: handle navigation or show details
                                        console.log("Clicked event:", event.id);
                                        navigate(`/dashboard/details`, {
                                            state: { event },
                                        });
                                    }}
                                />
                            ))
                        )}
                    </div>
                </SideDrawer>
            )}
        </div>
    );
}

const EventListItem = ({ event, onClick }) => {
    const image = event?.image1 || "/images/event-placeholder.jpg";
    const date = formatEventDate(event?.eventDate);

    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-[#E41F26] hover:bg-red-50/40 transition-colors text-left"
        >
            {/* Thumbnail */}
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                <img
                    src={image}
                    alt={event?.eventName}
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Details */}
            <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                        {event?.eventName}
                    </h3>
                    {event?.eventType && (
                        <span className="inline-flex items-center rounded-full bg-[#E41F260A] px-2 py-[2px] text-[10px] font-semibold text-[#E41F26] border border-[#E41F26]/30 whitespace-nowrap">
                            {event.eventType}
                        </span>
                    )}
                </div>

                {event?.slogan && (
                    <p className="text-[11px] text-gray-500 line-clamp-1">
                        {event.slogan}
                    </p>
                )}

                <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-600">
                    {date && (
                        <span className="inline-flex items-center gap-1">
                            <span className="h-1 w-1 rounded-full bg-gray-400" />
                            {date}
                        </span>
                    )}
                    {(event?.venue || event?.country) && (
                        <span className="inline-flex items-center gap-1">
                            <span className="h-1 w-1 rounded-full bg-gray-400" />
                            {event?.venue || "Venue"}, {event?.country || ""}
                        </span>
                    )}
                    {event?.eventCategory && (
                        <span className="inline-flex items-center gap-1">
                            <span className="h-1 w-1 rounded-full bg-gray-400" />
                            {event.eventCategory}
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
};

export default UpcomingEvents;

// import { useState } from "react";
// import { useGetAllEvents } from "../../hooks/EventsHooks";
// import { UpcomingEventCard, UpcomingEventSkeleton } from "./UpcomingEventCard";
// import { SideDrawer } from "../../components/SideDrawer";
// import { formatEventDate } from "../../helpers/functions";
// import { useNavigate } from "react-router";

// function UpcomingEvents() {
//     const navigate = useNavigate();
//     const [open, setOpen] = useState(false);
//     const [page, setPage] = useState(0); // Initial page state

//     const { data: allEvents = [], isLoading: gettingAllEvents } =
//         useGetAllEvents({ page, direction: "" }); // Fetch events with pagination

//     const handleNextPage = () => {
//         if (allEvents.hasNextPage) {
//             setPage(page + 1); // Move to the next page
//         }
//     };

//     const handlePreviousPage = () => {
//         if (allEvents.hasPreviousPage) {
//             setPage(page - 1); // Move to the previous page
//         }
//     };

//     return (
//         <div className="space-y-4">
//             <div className="flex justify-between">
//                 <h2 className="text-[14px] font-semibold text-gray-800">
//                     Upcoming Event
//                 </h2>
//                 <button
//                     className="text-[#FA6400] text-[12px] cursor-pointer"
//                     onClick={() => setOpen(true)}
//                 >
//                     See all
//                 </button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
//                 {gettingAllEvents
//                     ? Array.from({ length: 4 }).map((_, idx) => (
//                           <UpcomingEventSkeleton key={idx} />
//                       ))
//                     : allEvents.data
//                           .slice(0, 4)
//                           .map((event) => (
//                               <UpcomingEventCard event={event} key={event.id} />
//                           ))}
//             </div>

//             {open && (
//                 <SideDrawer
//                     handleClose={() => setOpen(false)}
//                     title="Upcoming Events"
//                     width={500}
//                 >
//                     <div className="space-y-3">
//                         {gettingAllEvents ? (
//                             Array.from({ length: 6 }).map((_, idx) => (
//                                 <div
//                                     key={idx}
//                                     className="w-full h-20 rounded-lg bg-gray-100 animate-pulse"
//                                 />
//                             ))
//                         ) : allEvents.data.length === 0 ? (
//                             <p className="text-sm text-gray-500">
//                                 No events found.
//                             </p>
//                         ) : (
//                             allEvents.data.map((event) => (
//                                 <EventListItem
//                                     key={event.id}
//                                     event={event}
//                                     onClick={() => {
//                                         // TODO: handle navigation or show details
//                                         console.log("Clicked event:", event.id);
//                                         navigate(`/dashboard/details`, {
//                                             state: { event },
//                                         });
//                                     }}
//                                 />
//                             ))
//                         )}
//                     </div>
//                 </SideDrawer>
//             )}
//         </div>
//     );
// }

// const EventListItem = ({ event, onClick }) => {
//     const image = event?.image1 || "/images/event-placeholder.jpg";
//     const date = formatEventDate(event?.eventDate);

//     return (
//         <button
//             type="button"
//             onClick={onClick}
//             className="w-full flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-[#E41F26] hover:bg-red-50/40 transition-colors text-left"
//         >
//             {/* Thumbnail */}
//             <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
//                 <img
//                     src={image}
//                     alt={event?.eventName}
//                     className="h-full w-full object-cover"
//                 />
//             </div>

//             {/* Details */}
//             <div className="flex-1 space-y-1">
//                 <div className="flex items-center justify-between gap-2">
//                     <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
//                         {event?.eventName}
//                     </h3>
//                     {event?.eventType && (
//                         <span className="inline-flex items-center rounded-full bg-[#E41F260A] px-2 py-[2px] text-[10px] font-semibold text-[#E41F26] border border-[#E41F26]/30 whitespace-nowrap">
//                             {event.eventType}
//                         </span>
//                     )}
//                 </div>

//                 {event?.slogan && (
//                     <p className="text-[11px] text-gray-500 line-clamp-1">
//                         {event.slogan}
//                     </p>
//                 )}

//                 <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-600">
//                     {date && (
//                         <span className="inline-flex items-center gap-1">
//                             <span className="h-1 w-1 rounded-full bg-gray-400" />
//                             {date}
//                         </span>
//                     )}
//                     {(event?.venue || event?.country) && (
//                         <span className="inline-flex items-center gap-1">
//                             <span className="h-1 w-1 rounded-full bg-gray-400" />
//                             {event?.venue || "Venue"}, {event?.country || ""}
//                         </span>
//                     )}
//                     {event?.eventCategory && (
//                         <span className="inline-flex items-center gap-1">
//                             <span className="h-1 w-1 rounded-full bg-gray-400" />
//                             {event.eventCategory}
//                         </span>
//                     )}
//                 </div>
//             </div>
//         </button>
//     );
// };

// export default UpcomingEvents;
