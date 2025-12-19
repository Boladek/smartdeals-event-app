import React from "react";
import { Controller } from "react-hook-form";
import { BaseInput } from "../../components/BaseInput";
import { BaseTextArea } from "../../components/BaseTextArea";

const EventName = ({ control, errors }) => {
    return (
        <>
            <Controller
                name="eventName"
                control={control}
                rules={{ required: "Event Name is required" }}
                render={({ field }) => (
                    <BaseInput
                        label="Event Name"
                        {...field}
                        error={errors.eventName}
                        errorText={errors.eventName?.message}
                    />
                )}
            />
            <Controller
                name="description"
                control={control}
                render={({ field }) => (
                    <BaseTextArea
                        label="Event Description"
                        {...field}
                        error={errors.description}
                        errorText={errors.description?.message}
                    />
                )}
            />
        </>
    );
};

export default EventName;
