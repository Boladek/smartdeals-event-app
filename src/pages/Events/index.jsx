import React from "react";
import EnableLocationHook from "../../hooks/EnableLocationHook";
import { EventPermissionCard } from "./EventPermissionCard";
import { EventCentreCard } from "./EventCentreCard";

function EventsPage() {
    const { location } = EnableLocationHook();
    return (
        <div>
            {location === null ? <EventPermissionCard /> : <EventCentreCard />}
        </div>
    );
}

export default EventsPage;
