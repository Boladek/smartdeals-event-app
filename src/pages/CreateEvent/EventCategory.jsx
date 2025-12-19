import React from "react";
import { Controller } from "react-hook-form";
import { BaseSelect } from "../../components/BaseSelect";
import { CustomSelect } from "../../components/CustomSelect";
import {
    useGetEventByCategory,
    useGetEventClass,
    useGetEventType,
} from "../../hooks/EventsHooks";

const EventCategory = ({ control, errors }) => {
    const { data: eventCategories = [], isLoading: gettingEventCategory } =
        useGetEventByCategory();
    const { data: eventClass = [] } = useGetEventClass();

    const { data: eventTypes = [] } = useGetEventType();

    return (
        <>
            <Controller
                name="eventClass"
                control={control}
                render={({ field }) => (
                    <BaseSelect
                        label="Event Class"
                        {...field}
                        error={errors.eventClass}
                        errorText={errors.eventClass?.message}
                    >
                        <option></option>
                        {eventClass.map((item) => (
                            <option key={item.code} value={item.code}>
                                {item.name_}
                            </option>
                        ))}
                    </BaseSelect>
                )}
            />

            <Controller
                name="eventType"
                control={control}
                render={({ field }) => (
                    <BaseSelect
                        label="Event Type"
                        {...field}
                        error={errors.eventType}
                        errorText={errors.eventType?.message}
                    >
                        <option></option>
                        {eventTypes.map((item) => (
                            <option key={item.code} value={item.code}>
                                {item.name}
                            </option>
                        ))}
                    </BaseSelect>
                )}
            />

            <CustomSelect
                label="Event Category"
                name="eventCategory"
                id="eventCategory"
                control={control}
                options={
                    eventCategories?.map((item) => ({
                        value: item.code,
                        label: item.name,
                    })) ?? []
                }
                error={!!errors.eventCategory}
                errorText={errors.eventCategory?.message}
                rules={{ required: "Event category is required" }}
                isLoading={gettingEventCategory}
            />
        </>
    );
};

export default EventCategory;
