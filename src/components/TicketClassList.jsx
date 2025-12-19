// import React, { useState, useEffect } from "react";
import { TicketCard } from "./TicketCard";
// import { useLocation } from "react-router";
// import { useGetEventTickets } from "../hooks/EventsHooks";
// import TicketCard from "./TicketCard";

// Fake loader spinner component
const Loader = () => (
    <div className="flex justify-center items-center space-x-2">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-4 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
);

export const TicketClassList = ({
    selectTicket,
    selectedTicket,
    tickets,
    loading,
}) => {
    // const [loading, setLoading] = useState(true);
    // const [ticketData, setTicketData] = useState([]);

    // useEffect(() => {
    //     // Simulate fetching tickets
    //     setTimeout(() => {
    //         setTicketData(tickets);
    //         setLoading(false);
    //     }, 2000); // Simulate 2-second delay for loading tickets
    // }, [tickets]);

    if (loading) {
        return <Loader />;
    }

    if (tickets.length === 0) return null;

    return (
        <div className="space-y-3">
            <p className="text-[14px] font-[600]">Ticket List</p>
            <div className="space-y-2">
                {tickets.map((ticket) => (
                    <TicketCard
                        key={ticket.id}
                        ticket={ticket}
                        selectTicket={selectTicket}
                        selectedTicket={selectedTicket}
                    />
                ))}
            </div>
        </div>
    );
};

export default TicketClassList;
