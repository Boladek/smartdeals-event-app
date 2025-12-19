import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { UseAuth } from "../../contexts/AuthContext";
import EditEventForm from "./EditEventForm";
import { BackButton } from "../../components/BackButton";

function EditEvent() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn } = UseAuth();
    const event = location.state?.event || {};
    
    // useEffect(() => {}, [])

    return (
        <div className="space-y-8 p-4">
            <div className="flex gap-4 items-center">
                <BackButton onClick={() => navigate(-1)} />

                <p>Edit Event</p>
            </div>
            <EditEventForm event={event} />
        </div>
    );
}

export default EditEvent;
