import React from "react";
import EventDescription from "./EventDescription";
import { useParams } from "react-router";
import { useGetEvent } from "../../hooks/UserEventHooks";

function EventInformationSkeleton() {
    return (
        <div className="space-y-6 pb-4 animate-pulse">
            {/* Back button placeholder */}
            <div className="h-10 w-24 rounded-lg bg-gray-200" />

            {/* Banner carousel placeholder */}
            <div className="h-56 md:h-72 w-full rounded-2xl bg-gray-200 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
            </div>

            {/* Title + Share */}
            <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 flex-1">
                    <div className="h-5 w-2/3 rounded bg-gray-200" />
                    <div className="h-3 w-1/2 rounded bg-gray-100" />
                </div>

                <div className="h-9 w-36 rounded-lg bg-gray-200" />
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg space-y-2">
                    <div className="h-4 w-1/2 rounded bg-gray-200" />
                    <div className="h-3 w-2/3 rounded bg-gray-100" />
                </div>

                <div className="p-4 border rounded-lg space-y-2">
                    <div className="h-4 w-1/2 rounded bg-gray-200" />
                    <div className="h-3 w-2/3 rounded bg-gray-100" />
                </div>

                <div className="p-4 rounded-lg bg-gray-100 border flex items-center justify-between">
                    <div className="h-4 w-32 rounded bg-gray-200" />
                    <div className="h-8 w-28 rounded bg-gray-200" />
                </div>

                <div className="p-4 rounded-lg border">
                    <div className="h-4 w-40 rounded bg-gray-200 mb-3" />
                    <div className="space-y-2">
                        <div className="h-10 rounded bg-gray-100" />
                        <div className="h-10 rounded bg-gray-100" />
                        <div className="h-10 rounded bg-gray-100" />
                    </div>
                </div>
            </div>

            {/* Organizer */}
            <div className="flex gap-4 items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="space-y-2">
                    <div className="h-4 w-40 rounded bg-gray-200" />
                    <div className="h-3 w-24 rounded bg-gray-100" />
                </div>
            </div>

            {/* CTA */}
            <div className="flex justify-end gap-3">
                <div className="h-10 w-32 rounded-full bg-gray-200" />
                <div className="h-10 w-32 rounded-full bg-gray-200" />
            </div>
        </div>
    );
}

export default function EventInformation() {
    const { id, class: eventClass } = useParams();
    const { data, isLoading } = useGetEvent({ eventId: id, eventClass });

    if (isLoading) return <EventInformationSkeleton />;

    return <EventDescription event={data} />;
}
