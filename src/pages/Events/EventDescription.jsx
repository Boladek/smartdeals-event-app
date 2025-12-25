import { useEffect, useRef, useState, useMemo } from "react";
import {
    FaHeart,
    FaShareAlt,
    FaCalendarAlt,
    FaMinus,
    FaPlus,
    FaTicketAlt,
    FaChevronRight,
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaSnapchatGhost,
    FaTiktok,
    FaMapMarkerAlt,
} from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
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
import { ShareHook } from "../../hooks/ShareHook";

// ✅ Helper: basic URL validation
const isValidUrl = (url) => {
    if (!url) return false;
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

// (you referenced this in your code; keeping it here so copy/paste works)
const cleanHandle = (handle) =>
    String(handle || "")
        .replace(/^@+/, "")
        .trim();

const EventDescription = ({ event }) => {
    const location = useLocation();
    const navigate = useNavigate();
    // const event = location.state?.event || {};
    const { isLoggedIn } = UseAuth();
    const { share } = ShareHook();

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

    // ✅ Share URL: current url + ?eventId=...
    const shareUrl = useMemo(() => {
        const base =
            typeof window !== "undefined"
                ? window.location.href.split("#")[0]
                : "";
        return base;
    }, [event?.eventId]);

    const shareText = useMemo(() => {
        const name = event?.eventName || "Event";
        const venue = event?.venue ? ` @ ${event.venue}` : "";
        return `You're invited: ${name}${venue}`;
    }, [event?.eventName, event?.venue]);

    // ✅ Maps URL (only meaningful for physical events)
    const mapsUrl = useMemo(() => {
        // Prefer address; fallback to coordinates
        const query = event?.address?.trim()
            ? event.address
            : event?.latitude && event?.longitude
            ? `${event.latitude},${event.longitude}`
            : "";

        return query
            ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  query
              )}`
            : null;
    }, [event?.address, event?.latitude, event?.longitude]);

    const openShare = (url) => {
        if (typeof window === "undefined") return;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            alert("Invite link copied!");
        } catch {
            alert("Could not copy link. Please copy manually.");
        }
    };

    const onClickShareInvite = () => {
        share({
            url: shareUrl,
            text: shareText,
            title: "Smart Deals Event",
        });
    };

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

    console.log({ event });

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

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start">
                {/* Title & slogan */}
                <div className="order-1 sm:order-none">
                    <h2 className="text-lg font-semibold uppercase">
                        {event.eventName}
                    </h2>
                    <p className="text-xs text-gray-500 uppercase">
                        {event.slogan}
                    </p>
                </div>

                {/* Share + icons (below title on mobile) */}
                <div className="order-2 sm:order-none">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <button
                            type="button"
                            onClick={onClickShareInvite}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/15 transition"
                            title="Copy invite link"
                        >
                            <FaShareAlt className="text-primary" />
                            <span>Share Invite</span>
                        </button>

                        {/* Icons row (scrollable on mobile) */}
                        <div className="w-full sm:w-auto overflow-x-auto">
                            <div className="flex items-center gap-2 min-w-max pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopyLink();
                                    }}
                                    className="h-10 w-10 shrink-0 rounded-full border border-primary/20 bg-white text-primary flex items-center justify-center hover:bg-primary/10 transition"
                                    title="Copy link"
                                >
                                    <MdContentCopy
                                        size={16}
                                        className="text-primary"
                                    />
                                </button>

                                {/* ✅ Google Maps (only if physical event + address/coords exist) */}
                                {!event?.isVirtual && mapsUrl && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openShare(mapsUrl);
                                        }}
                                        className="h-10 w-10 shrink-0 rounded-full border border-primary/20 bg-white text-primary flex items-center justify-center hover:bg-primary/10 transition"
                                        title="Open location in Google Maps"
                                    >
                                        <FaMapMarkerAlt
                                            size={16}
                                            className="text-primary"
                                        />
                                    </button>
                                )}

                                {/* Instagram (only if igHandle exists) */}
                                {event?.igHandle && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openShare(
                                                `https://instagram.com/${cleanHandle(
                                                    event.igHandle
                                                )}`
                                            );
                                        }}
                                        className="h-10 w-10 shrink-0 rounded-full border border-primary/20 bg-white text-primary flex items-center justify-center hover:bg-primary/10 transition"
                                        title={`Instagram: ${event.igHandle}`}
                                    >
                                        <FaInstagram
                                            size={16}
                                            className="text-primary"
                                        />
                                    </button>
                                )}

                                {/* Facebook share (only if facebookHandle exists) */}
                                {event?.facebookHandle && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openShare(
                                                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                                    shareUrl
                                                )}`
                                            );
                                        }}
                                        className="h-10 w-10 shrink-0 rounded-full border border-primary/20 bg-white text-primary flex items-center justify-center hover:bg-primary/10 transition"
                                        title="Share on Facebook"
                                    >
                                        <FaFacebook
                                            size={16}
                                            className="text-primary"
                                        />
                                    </button>
                                )}

                                {/* X/Twitter share (only if twitterHandle exists) */}
                                {event?.twitterHandle && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openShare(
                                                `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                                                    shareText
                                                )}&url=${encodeURIComponent(
                                                    shareUrl
                                                )}`
                                            );
                                        }}
                                        className="h-10 w-10 shrink-0 rounded-full border border-primary/20 bg-white text-primary flex items-center justify-center hover:bg-primary/10 transition"
                                        title="Share on X"
                                    >
                                        <FaTwitter
                                            size={16}
                                            className="text-primary"
                                        />
                                    </button>
                                )}

                                {/* Snapchat (only if snapchat exists) */}
                                {event?.snapchat && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openShare(
                                                `https://www.snapchat.com/add/${cleanHandle(
                                                    event.snapchat
                                                )}`
                                            );
                                        }}
                                        className="h-10 w-10 shrink-0 rounded-full border border-primary/20 bg-white text-primary flex items-center justify-center hover:bg-primary/10 transition"
                                        title={`Snapchat: ${event.snapchat}`}
                                    >
                                        <FaSnapchatGhost
                                            size={16}
                                            className="text-primary"
                                        />
                                    </button>
                                )}

                                {/* TikTok (only if tiktok exists) */}
                                {event?.tiktok && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openShare(
                                                `https://www.tiktok.com/@${cleanHandle(
                                                    event.tiktok
                                                )}`
                                            );
                                        }}
                                        className="h-10 w-10 shrink-0 rounded-full border border-primary/20 bg-white text-primary flex items-center justify-center hover:bg-primary/10 transition"
                                        title={`TikTok: ${event.tiktok}`}
                                    >
                                        <FaTiktok
                                            size={16}
                                            className="text-primary"
                                        />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg flex gap-2 items-center">
                    <FaCalendarAlt className="text-red-600" />
                    <div>
                        {event.perpetual ? (
                            <p className="font-semibold">
                                Every {event.eventDate}
                            </p>
                        ) : (
                            <p className="font-semibold">{formattedDate}</p>
                        )}

                        <p className="text-xs text-gray-600">{formattedTime}</p>
                    </div>
                </div>

                {/* ✅ Updated Address/Meeting link card */}
                <div className="p-4 border rounded-lg flex gap-2 items-center">
                    <FaMapMarkerAlt className="text-red-600" />
                    <div className="min-w-0">
                        {event?.isVirtual ? (
                            <>
                                <p className="font-semibold uppercase">
                                    Online event
                                </p>

                                {event?.meetingLink &&
                                isValidUrl(event.meetingLink) ? (
                                    <a
                                        href={event.meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary underline break-all"
                                    >
                                        {event.meetingLink}
                                    </a>
                                ) : (
                                    <p className="text-xs text-gray-600">
                                        Meeting link will be shared with
                                        attendees.
                                    </p>
                                )}
                            </>
                        ) : (
                            <>
                                <p className="font-semibold uppercase">
                                    {event?.venue || "Venue TBC"}
                                </p>

                                <p className="text-xs text-gray-600">
                                    {event?.address || "Address not provided"}
                                </p>
                            </>
                        )}
                    </div>
                </div>

                <div
                    className={`p-4 bg-[#FBD5D733] rounded-lg flex items-center ${
                        isPaid ? "justify-between" : ""
                    }`}
                >
                    <div className="flex gap-2 items-center">
                        <FaTicketAlt className="text-red-600" />
                        <span className="font-semibold">
                            {isPaid ? "PAID EVENT" : "FREE EVENT"}
                        </span>
                    </div>

                    {isPaid && (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={decreaseAttendees}
                                className="p-2 bg-red-100 text-red-600 rounded"
                            >
                                <FaMinus />
                            </button>
                            <span>{attendees}</span>
                            <button
                                type="button"
                                onClick={increaseAttendees}
                                className="p-2 bg-red-100 text-red-600 rounded"
                            >
                                <FaPlus />
                            </button>
                        </div>
                    )}
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
                        <div className="text-[14px] font-semibold text-gray-800 flex gap-4 items-center">
                            Guest List
                            <span className="bg-red-600 text-white rounded-full px-3 py-1 text-sm flex justify-center items-center">
                                {attendees}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => null}
                            className="text-red-600 hover:text-red-800"
                        >
                            <FaChevronRight size={12} />
                        </button>
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
                    <button
                        type="button"
                        className="text-red-600 flex items-center gap-2 text-sm"
                    >
                        <FaHeart /> Add to favorite
                    </button>
                )}

                {isPaid && (
                    <>
                        {guests.length === 0 ? (
                            <button
                                type="button"
                                className="px-6 py-2 bg-red-600 text-white rounded-full"
                                onClick={onClickRSVP}
                            >
                                RSVP
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="px-6 py-2 bg-red-600 text-white rounded-full"
                                onClick={handleAction}
                            >
                                Proceed
                            </button>
                        )}
                    </>
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
