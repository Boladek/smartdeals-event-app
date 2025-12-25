import  { useEffect, useRef, useState } from "react";
import { AddTicketForm } from "./AddTicketModal";
import { useLocation } from "react-router";
import { useGetEventTickets } from "../../hooks/UserEventHooks";
import { UpdateTicketForm } from "./UpdateTicketModal";
import { DeleteTicketConfirmModal } from "./DeleteTicketModal";

function TicketDetails() {
    const location = useLocation();
    const event = location.state?.event || {};

    const {
        data: tickets = [],
        isLoading: gettingTickets,
        refetch,
    } = useGetEventTickets({
        eventId: event.eventId,
    });

    const containerRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);

    useEffect(() => {
        const onDown = (e) => {
            if (!openMenuId) return;
            if (!containerRef.current) return;
            if (!containerRef.current.contains(e.target)) setOpenMenuId(null);
        };

        const onKey = (e) => {
            if (e.key === "Escape") setOpenMenuId(null);
        };

        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [openMenuId]);

    const hasTickets = tickets.length > 0;

    const onDeleteTicket = (ticket) => {
        // you probably will call delete API here, then refetch
        setSelectedTicket(ticket);
        setOpenDelete(true);
        setOpenMenuId(null);
    };

    const onEditTicket = (ticket) => {
        // alert(`Edit ticket ${id}`);
        setSelectedTicket(ticket);
        setOpenEdit(true);
        setOpenMenuId(null);
    };

    const onSendInvite = (id) => {
        alert(`Send invite ${id}`);
        setOpenMenuId(null);
    };

    return (
        <div ref={containerRef} className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Ticket Class
                </h2>

                {/* Show add button when tickets exist OR while loading (optional) */}
                {(hasTickets || gettingTickets) && (
                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="hidden sm:inline-flex items-center justify-center rounded-full bg-[#E41F26] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#E41F26]/90 active:scale-[0.99] transition"
                    >
                        Add New Ticket
                    </button>
                )}
            </div>

            {/* Body */}
            <div className="mt-4">
                {/* 1) SKELETON STATE */}
                {gettingTickets ? (
                    <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, idx) => (
                            <TicketRowSkeleton key={idx} />
                        ))}

                        {/* mobile add button placeholder (optional) */}
                        <div className="sm:hidden h-12 rounded-full bg-gray-100 animate-pulse" />
                    </div>
                ) : !hasTickets ? (
                    /* 2) EMPTY STATE */
                    <div className="rounded-2xl bg-white p-6 sm:p-10">
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-6 grid place-items-center">
                                <div className="h-16 w-16 rounded-2xl bg-gray-100 grid place-items-center">
                                    <svg
                                        width="28"
                                        height="28"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="text-gray-300"
                                    >
                                        <path
                                            d="M8 7h8a2 2 0 0 1 2 2v2a2 2 0 1 0 0 4v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-2a2 2 0 1 0 0-4V9a2 2 0 0 1 2-2Z"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                        />
                                        <path
                                            d="M12 8.5v7"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeDasharray="2.5 2.5"
                                        />
                                    </svg>
                                </div>
                            </div>

                            <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                                There is nothing here yet
                            </h3>
                            <p className="mt-3 text-sm sm:text-base text-gray-500 max-w-md">
                                Explore a wide range of Ticket Class
                            </p>

                            <button
                                type="button"
                                onClick={() => setOpen(true)}
                                className="mt-8 inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-[#E41F26] px-10 py-4 text-base font-semibold text-white shadow-md hover:bg-[#E41F26]/90 active:scale-[0.99] transition"
                            >
                                Add New Ticket
                            </button>
                        </div>
                    </div>
                ) : (
                    /* 3) LIST STATE */
                    <div className="space-y-3">
                        {tickets.map((ticket) => {
                            const isOpen = openMenuId === ticket.ticketId; // use ticketId consistently

                            return (
                                <div
                                    key={ticket.ticketId}
                                    className="relative rounded-2xl bg-gray-50 px-4 sm:px-6 py-4 flex items-center justify-between"
                                >
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-sm font-semibold text-gray-900">
                                            {ticket.ticketClass}
                                        </span>
                                        <span className="text-sm text-gray-500 capitalize">
                                            ({ticket.category})
                                        </span>
                                    </div>

                                    {/* 3 dots */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenMenuId((prev) =>
                                                prev === ticket.ticketId
                                                    ? null
                                                    : ticket.ticketId
                                            )
                                        }
                                        className="h-9 w-10 grid place-items-center rounded-xl hover:bg-gray-100 active:bg-gray-200 transition"
                                        aria-label="Open ticket actions"
                                    >
                                        <span className="flex gap-1">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#E41F26]" />
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#E41F26]" />
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#E41F26]" />
                                        </span>
                                    </button>

                                    {/* Dropdown */}
                                    {isOpen && (
                                        <div className="absolute right-4 sm:right-6 top-[56px] z-20 w-56 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
                                            <MenuItem
                                                onClick={() =>
                                                    onEditTicket(ticket)
                                                }
                                            >
                                                Edit
                                            </MenuItem>

                                            <div className="h-px bg-gray-100" />

                                            <MenuItem
                                                onClick={() =>
                                                    onSendInvite(ticket)
                                                }
                                            >
                                                Send Invite
                                            </MenuItem>

                                            <div className="h-px bg-gray-100" />

                                            <MenuItem
                                                danger
                                                onClick={() =>
                                                    onDeleteTicket(ticket)
                                                }
                                            >
                                                Delete
                                            </MenuItem>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Mobile add button */}
                        <button
                            type="button"
                            onClick={() => setOpen(true)}
                            className="sm:hidden mt-2 inline-flex w-full items-center justify-center rounded-full bg-[#E41F26] px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#E41F26]/90 active:scale-[0.99] transition"
                        >
                            Add New Ticket
                        </button>
                    </div>
                )}
            </div>

            {open && (
                <AddTicketForm
                    handleClose={() => {
                        setOpen(false);
                        refetch();
                    }}
                    event={event}
                />
            )}

            {openEdit && selectedTicket && (
                <UpdateTicketForm
                    handleClose={() => {
                        setOpenEdit(false);
                        refetch();
                    }}
                    event={event}
                    ticket={selectedTicket}
                />
            )}

            {openDelete && selectedTicket && (
                <DeleteTicketConfirmModal
                    handleClose={() => {
                        setOpenDelete(false);
                        refetch();
                    }}
                    event={event}
                    ticket={selectedTicket}
                />
            )}
        </div>
    );
}

function TicketRowSkeleton() {
    return (
        <div className="rounded-2xl bg-gray-50 px-4 sm:px-6 py-4 flex items-center justify-between animate-pulse">
            {/* Left side */}
            <div className="flex items-baseline gap-3">
                <div className="h-5 w-28 rounded bg-gray-200" />
                <div className="h-4 w-20 rounded bg-gray-200" />
            </div>

            {/* 3 dots skeleton */}
            <div className="h-9 w-10 rounded-xl bg-gray-200" />
        </div>
    );
}

function MenuItem({ children, onClick, danger }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "w-full px-5 py-4 text-left text-base",
                "hover:bg-gray-50 active:bg-gray-100 transition",
                danger ? "text-[#E41F26] font-semibold" : "text-gray-800",
            ].join(" ")}
        >
            {children}
        </button>
    );
}

export default TicketDetails;
