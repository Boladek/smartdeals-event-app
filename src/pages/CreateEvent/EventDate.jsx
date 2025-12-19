import React from "react";
import { Controller } from "react-hook-form";
import { BaseInput } from "../../components/BaseInput";
import { BaseSelect } from "../../components/BaseSelect";
import { useGetEventDays } from "../../hooks/EventsHooks";
import { CustomSelect } from "../../components/CustomSelect";

const EventDate = ({ control, errors, watch }) => {
    const watchPerpetual = watch("perpetual");
    const { data, isLoading } = useGetEventDays();

    return (
        <>
            <Controller
                name="perpetual"
                control={control}
                render={({ field }) => (
                    <div className="flex text-sm gap-2 items-center">
                        <input
                            type="checkbox"
                            id="perpetual"
                            className="accent-primary h-4 w-4"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                        />
                        <label htmlFor="perpetual">Perpetual</label>
                    </div>
                )}
            />

            {watchPerpetual !== true && (
                <>
                    <Controller
                        name="eventDate"
                        control={control}
                        rules={{ required: "Event Date is required" }}
                        render={({ field }) => (
                            <BaseInput
                                label="Event Date"
                                type="date"
                                {...field}
                                error={errors.eventDate}
                                errorText={errors.eventDate?.message}
                            />
                        )}
                    />
                </>
            )}
            {watchPerpetual === true && (
                // <Controller
                //     name="eventDate"
                //     control={control}
                //     render={({ field }) => (
                //         <BaseSelect {...field} label="Select Day">
                //             <option value="Monday">Monday</option>
                //             <option value="Tuesday">Tuesday</option>
                //             <option value="Wednesday">Wednesday</option>
                //             <option value="Thursday">Thursday</option>
                //             <option value="Friday">Friday</option>
                //             <option value="Saturday">Saturday</option>
                //             <option value="Sunday">Sunday</option>
                //         </BaseSelect>
                //     )}
                // />
                <CustomSelect
                    label="Event Date"
                    name="eventDate"
                    id="eventDate"
                    control={control}
                    options={
                        data?.map((item) => ({
                            value: item.name,
                            label: item.name,
                        })) ?? []
                    }
                    error={!!errors.eventDate}
                    errorText={errors.eventDate?.message}
                    rules={{ required: "Day is required" }}
                    isLoading={isLoading}
                />
            )}

            <Controller
                name="startTime"
                control={control}
                rules={{ required: "Start Time is required" }}
                render={({ field }) => (
                    <BaseInput
                        label="Start Time"
                        type="time"
                        {...field}
                        error={errors.startTime}
                        errorText={errors.startTime?.message}
                    />
                )}
            />
            <Controller
                name="endTime"
                control={control}
                rules={{ required: "End Time is required" }}
                render={({ field }) => (
                    <BaseInput
                        label="End Time"
                        type="time"
                        {...field}
                        error={errors.endTime}
                        errorText={errors.endTime?.message}
                    />
                )}
            />
        </>
    );
};

export default EventDate;
