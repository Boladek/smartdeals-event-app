import { useState } from "react";
import {
    FaShareAlt,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaTicketAlt,
    FaEdit,
} from "react-icons/fa";
import { BackButton } from "../../components/BackButton";
import { useLocation, useNavigate } from "react-router";
import { formatEventDate, formatEventTime } from "../../helpers/functions";
import TicketDetails from "./TicketDetails";
import EventBannerCarousel from "../../components/EventBannerCarousel";
import { UseAuth } from "../../contexts/AuthContext";

const EventDetails = () => {
    const { user } = UseAuth();
    const location = useLocation();
    const event = location.state?.event || {};
    const navigate = useNavigate();

    const formattedDate = formatEventDate(event.eventDate);
    const formattedTime = formatEventTime(event.startTime, event.endTime);

    const isPaid = event.eventType === "Paid";

    const bannerImages = [
        event.image1,
        event.image2,
        event.image3,
        event.image4,
    ].filter(Boolean);

    const goToEditEvent = () => {
        navigate("/edit-event", { state: { event } });
    };

    const isOwner = event.emailAddress === user.emailAddress;

    return (
        <div className="space-y-6 pb-4">
            <BackButton onClick={() => navigate(-1)} />

            <EventBannerCarousel
                images={bannerImages}
                alt={event.eventName || "Event"}
                autoPlay
                interval={4500}
            />

            {/* Event Title and Actions */}
            <div className="flex justify-between items-start gap-4">
                <div className="space-y-2">
                    <h2 className="text-[20px] font-semibold text-gray-800 uppercase">
                        {event.eventName || "Event"}
                    </h2>

                    {event.slogan && (
                        <p className="text-xs font-medium text-gray-500 uppercase">
                            {event.slogan}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-2 mt-2">
                        {event.eventCategory && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-[2px] text-[11px] font-semibold text-gray-700">
                                {event.eventCategory}
                            </span>
                        )}
                        {event.eventType && (
                            <span className="inline-flex items-center rounded-full bg-[#E41F260A] px-3 py-[2px] text-[11px] font-semibold text-[#E41F26]">
                                {event.eventType}
                            </span>
                        )}
                        {event.eventZone && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-[2px] text-[11px] font-medium text-gray-600">
                                {event.eventZone}
                            </span>
                        )}
                        {event.eventClass && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-[2px] text-[11px] font-medium text-gray-600">
                                {event.eventClass}
                            </span>
                        )}
                    </div>
                </div>

                {/* Right buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                    {isOwner && (
                        <button
                            onClick={goToEditEvent}
                            className="text-gray-700 border border-gray-200 bg-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold hover:bg-gray-50"
                            title="Edit Event"
                        >
                            <FaEdit size={16} />
                            Edit Event
                        </button>
                    )}

                    <button
                        className="text-red-600 border border-red-200 bg-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold hover:bg-red-50"
                        title="Share Invite"
                    >
                        <FaShareAlt size={16} />
                        Share Invite
                    </button>
                </div>
            </div>

            {/* Event Meta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                {/* Date and Time */}
                <div className="flex items-center space-x-2 p-4 border border-gray-300 rounded-lg col-span-1">
                    <FaCalendarAlt size={20} className="text-red-600" />
                    <div>
                        <p className="text-[14px] font-semibold">
                            {formattedDate || "Date to be announced"}
                        </p>
                        <p className="text-xs text-gray-600">{formattedTime}</p>
                    </div>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-2 p-4 border border-gray-300 rounded-lg col-span-1">
                    <FaMapMarkerAlt size={20} className="text-red-600" />
                    <div>
                        <p className="text-[14px] font-semibold uppercase">
                            {event.venue || "Venue to be announced"}
                        </p>
                        <p className="text-xs text-gray-600">
                            {event.address ||
                                event.city ||
                                event.country ||
                                "Location details coming soon"}
                        </p>
                    </div>
                </div>

                {/* Ticket / Price */}
                <div className="flex items-center justify-between p-4 bg-[#FBD5D733] rounded-lg col-span-1 space-x-2">
                    <FaTicketAlt size={20} className="text-red-600" />
                    <div className="flex flex-1 justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-800">
                                {isPaid ? "PAID EVENT" : "FREE EVENT"}
                            </span>
                            {isPaid && event.discount && (
                                <span className="text-[11px] text-red-700 font-medium">
                                    {event.discount}% discount available
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div />
                {isOwner && <TicketDetails />}
                <div />
                <div />
            </div>
        </div>
    );
};

export default EventDetails;
