import { useEffect, useRef, useState } from "react";
import {
    FaHeart,
    FaShareAlt,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaMinus,
    FaPlus,
    FaTicketAlt,
    FaChevronRight,
} from "react-icons/fa";
import { BackButton } from "../../components/BackButton";
import { useLocation, useNavigate } from "react-router";
import { GuestForm } from "./GuestForm";
import {
    formatEventDate,
    formatEventTime,
    getOrganizerInitials,
} from "../../helpers/functions";
import {
    useBuyTicket,
    useBuyTicketGuest,
    useGetEventTickets,
} from "../../hooks/EventsHooks";
import TicketClassList from "../../components/TicketClassList";
import { UseAuth } from "../../contexts/AuthContext";
import { EventPayment } from "./EventPayment";
import { Overlay } from "../../components/Overlay";
import EventBannerCarousel from "../../components/EventBannerCarousel";
import { SuccessPage } from "../CreateEvent/SuccessPage";
import { Modal } from "../../components/Modal";

const EventDescription = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const event = location.state?.event || {};
    const { isLoggedIn } = UseAuth();

    const { data: tickets = [], isLoading: loading } = useGetEventTickets({
        eventId: event.eventId,
    });

    const { mutateAsync, isPending } = useBuyTicketGuest();
    const { mutateAsync: buyTicket, isPening: buyingTicket } = useBuyTicket();

    const [attendees, setAttendees] = useState(1);
    const [open, setOpen] = useState(false);
    const [openPay, setOpenPay] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [guests, setGuests] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);

    // 🔴 Ticket selection error handling
    const [ticketPickError, setTicketPickError] = useState(false);
    const ticketPickerRef = useRef(null);

    useEffect(() => {
        if (selectedTicket) setTicketPickError(false);
    }, [selectedTicket]);

    const increaseAttendees = () => {
        setAttendees((p) => p + 1);
        setGuests([]);
    };
    const decreaseAttendees = () => {
        if (attendees > 1) {
            setAttendees((p) => p - 1);
        }
        setGuests([]);
    };

    const formattedDate = formatEventDate(event.eventDate);
    const formattedTime = formatEventTime(event.startTime, event.endTime);
    const isPaid = event.eventType === "Paid";

    const bannerImages = [
        event.image1,
        event.image2,
        event.image3,
        event.image4,
    ].filter(Boolean);

    const organizerName =
        event.partnerName || event.username || "Event Organizer";

    // 🚨 Enforce ticket selection
    const requireTicketSelection = () => {
        if (tickets.length > 1 && !selectedTicket) {
            setTicketPickError(true);

            ticketPickerRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });

            alert("Please select a ticket category before you RSVP.");

            setTimeout(() => setTicketPickError(false), 3500);
            return false;
        }
        return true;
    };

    const onClickRSVP = () => {
        if (!requireTicketSelection()) return;
        setOpen(true);
    };

    const handleAction = async () => {
        try {
            if (guests.length > 0 && isPaid) {
                setOpenPay(true);
            } else {
                if (isLoggedIn) {
                    await buyTicket({
                        attendees: guests,
                        eventId: event.eventId,
                        eventName: event.eventName,
                        eventDate: event.eventDate,
                        eventType: event.eventType,
                        eventClass: event.eventClass,
                        eventVenue: event.venue,
                        ticketClass: selectedTicket?.ticketClass,
                        ticketId: selectedTicket?.ticketId,
                        amount: Number(selectedTicket?.amount || 0),
                        quantity: attendees,
                    });
                } else {
                    await mutateAsync({
                        attendees: guests,
                        eventId: event.eventId,
                        eventName: event.eventName,
                        eventDate: event.eventDate,
                        eventType: event.eventType,
                        eventClass: event.eventClass,
                        eventVenue: event.venue,
                        ticketClass: selectedTicket.ticketClass,
                        ticketId: selectedTicket.ticketId,
                        amount: Number(selectedTicket.amount),
                    });
                }
                setOpenSuccess(true);
            }
        } catch (error) {
            alert(
                error?.response?.data?.message ||
                    error?.message ||
                    "An error occurred"
            );
        }
    };

    useEffect(() => {
        if (selectedTicket) {
            setGuests([]);
            setAttendees(1);
        }
    }, [selectedTicket]);

    return (
        <div className="space-y-6 pb-4">
            {(isPending || buyingTicket) && <Overlay />}
            <BackButton onClick={() => navigate(-1)} />

            <EventBannerCarousel
                images={bannerImages}
                alt={event.eventName || "Event"}
                autoPlay
                interval={4500}
            />

            {/* Title */}
            <div className="flex justify-between items-start gap-4">
                <div>
                    <h2 className="text-lg font-semibold uppercase">
                        {event.eventName}
                    </h2>
                    <p className="text-xs text-gray-500 uppercase">
                        {event.slogan}
                    </p>
                </div>

                <button className="text-red-600 flex items-center gap-2 text-sm">
                    <FaShareAlt /> Share Invite
                </button>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg flex gap-2">
                    <FaCalendarAlt className="text-red-600" />
                    <div>
                        <p className="font-semibold">{formattedDate}</p>
                        <p className="text-xs text-gray-600">{formattedTime}</p>
                    </div>
                </div>

                <div className="p-4 border rounded-lg flex gap-2">
                    <FaMapMarkerAlt className="text-red-600" />
                    <div>
                        <p className="font-semibold uppercase">{event.venue}</p>
                        <p className="text-xs text-gray-600">{event.address}</p>
                    </div>
                </div>

                <div className="p-4 bg-[#FBD5D733] rounded-lg flex justify-between items-center">
                    <FaTicketAlt className="text-red-600" />
                    <span className="font-semibold">
                        {isPaid ? "PAID EVENT" : "FREE EVENT"}
                    </span>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={decreaseAttendees}
                            className="p-2 bg-red-100 text-red-600 rounded"
                        >
                            <FaMinus />
                        </button>
                        <span>{attendees}</span>
                        <button
                            onClick={increaseAttendees}
                            className="p-2 bg-red-100 text-red-600 rounded"
                        >
                            <FaPlus />
                        </button>
                    </div>
                </div>

                {/* 🎯 Ticket selector */}
                <div />
                <div
                    ref={ticketPickerRef}
                    className={[
                        "rounded-2xl transition-all",
                        ticketPickError
                            ? "ring-2 ring-red-600 ring-offset-2 bg-red-50 animate-pulse"
                            : "",
                    ].join(" ")}
                >
                    <TicketClassList
                        selectTicket={setSelectedTicket}
                        selectedTicket={selectedTicket}
                        tickets={tickets}
                        loading={loading}
                    />
                    {ticketPickError && (
                        <p className="text-xs text-red-600 mt-2 px-1">
                            Select a ticket category to continue
                        </p>
                    )}
                </div>
                <div />
                {selectedTicket && guests.length > 0 && (
                    <div
                        className="flex items-center justify-between p-4 bg-white rounded-lg col-span-1 border border-gray-200 cursor-pointer"
                        onClick={() => setOpen(true)}
                    >
                        {" "}
                        <div className="text-[14px] font-semibold text-gray-800 flex gap-4 items-center">
                            {" "}
                            Guest List{" "}
                            <span className="bg-red-600 text-white rounded-full px-3 py-1 text-sm flex justify-center items-center">
                                {" "}
                                {attendees}{" "}
                            </span>{" "}
                        </div>{" "}
                        <button
                            onClick={() => null}
                            className="text-red-600 hover:text-red-800"
                        >
                            {" "}
                            <FaChevronRight size={12} />{" "}
                        </button>{" "}
                    </div>
                )}
            </div>

            {/* Organizer */}
            <div className="flex gap-4 mt-6">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {getOrganizerInitials(event)}
                </div>
                <div>
                    <p className="font-semibold">{organizerName}</p>
                    <p className="text-sm text-gray-500">Organizer</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4">
                {isLoggedIn && (
                    <button className="text-red-600 flex items-center gap-2 text-sm">
                        <FaHeart /> Add to favorite
                    </button>
                )}

                {guests.length === 0 ? (
                    <button
                        className="px-6 py-2 bg-red-600 text-white rounded-full"
                        onClick={onClickRSVP}
                    >
                        RSVP
                    </button>
                ) : (
                    <button
                        className="px-6 py-2 bg-red-600 text-white rounded-full"
                        onClick={handleAction}
                    >
                        Proceed
                    </button>
                )}
            </div>

            {open && (
                <GuestForm
                    total={
                        selectedTicket?.category === "SINGLE" ? attendees : 1
                    }
                    handleClose={() => setOpen(false)}
                    handleGuests={setGuests}
                    guests={guests}
                />
            )}

            {openPay && selectedTicket && (
                <EventPayment
                    handleClose={() => setOpenPay(false)}
                    guests={guests}
                    attendees={attendees}
                    selectedTicket={selectedTicket}
                />
            )}

            {openSuccess && (
                <Modal handleClose={() => setOpenSuccess(false)}>
                    <SuccessPage
                        message="Ticket Acquisition successful"
                        description="Ticket details will be sent to guest emails"
                        link="/dashboard"
                    />
                </Modal>
            )}
        </div>
    );
};

export default EventDescription;
