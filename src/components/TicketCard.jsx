import React, { useState } from "react";
import { formatNumber } from "../helpers/functions";

export const TicketCard = ({ ticket, selectTicket, selectedTicket }) => {
    // State to manage the visibility of ticket details (accordion)
    const [isOpen, setIsOpen] = useState(false);

    // Toggle function for accordion dropdown
    const toggleAccordion = () => {
        if (!ticket.remaining) return; // Disable toggle if sold out
        setIsOpen(!isOpen);
    };

    // Check if ticket is sold out
    const isSoldOut = ticket.remaining === 0;

    // Check if this ticket is selected
    const isSelected = selectedTicket && selectedTicket.id === ticket.id;

    return (
        <div
            className={`bg-gray-100 rounded-lg p-4 transition-opacity duration-300 ease-in-out space-y-4 ${
                isSoldOut ? "bg-gray-400 opacity-50" : "hover:bg-gray-200"
            } ${isSelected ? "border-4 border-primary" : ""}`} // Highlight selected ticket
        >
            {/* Ticket Class */}
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <p className="font-semibold text-gray-800 text-[14px]">
                        {ticket.ticketClass}
                    </p>
                    <span className="text-sm text-gray-500 ml-2">
                        ({ticket.category === "SINGLE" ? "Single" : "Multiple"})
                    </span>
                </div>
                <button
                    className={`text-gray-500 hover:text-gray-700 ${
                        isSoldOut ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                    onClick={toggleAccordion}
                    disabled={isSoldOut} // Disable toggle button when sold out
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        className="bi bi-three-dots"
                        viewBox="0 0 16 16"
                    >
                        <path d="M3 9a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM3 5a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm0 8a1 1 0 1 1 2 0 1 1 0 0 1-2 0z" />
                    </svg>
                </button>
            </div>

            {/* Accordion Section: Ticket Details */}
            {isOpen && (
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div>
                        <strong>Guest(s):</strong> {ticket.attendees}
                    </div>
                    <div>
                        <strong>Amount:</strong> {formatNumber(ticket.amount)}
                    </div>
                    <div>
                        <strong>Remaining:</strong> {ticket.remaining}
                    </div>
                    <button
                        className="w-full py-2 bg-primary text-white rounded-full text-sm font-semibold mt-4"
                        onClick={() => {
                            selectTicket(ticket);
                            setIsOpen(false);
                        }}
                        disabled={isSoldOut} // Disable select button if sold out
                    >
                        {isSoldOut ? "Sold Out" : "Select"}
                    </button>
                </div>
            )}

            {/* Status Badge */}
            {/* <div className="flex justify-between items-center">
                <span
                    className={`px-4 py-2 rounded-full text-white text-sm ${
                        ticket.remaining > 0 ? "bg-green-500" : "bg-red-500"
                    }`}
                >
                    {ticket.remaining > 0 ? "Available" : "Sold Out"}
                </span>
            </div> */}
        </div>
    );
};
