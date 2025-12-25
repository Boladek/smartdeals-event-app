import React, { useEffect, useMemo } from "react";
import { Controller, useWatch, useForm } from "react-hook-form";
import { Modal } from "../../components/Modal";
import { BaseInput } from "../../components/BaseInput";
import { BaseButton } from "../../components/BaseButton";
import { useCreateTicket } from "../../hooks/UserEventHooks";
import { BaseSelect } from "../../components/BaseSelect";

export const AddTicketForm = ({ handleClose, event }) => {
    const { mutateAsync, isPending } = useCreateTicket();

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
        clearErrors,
    } = useForm({
        defaultValues: {
            ticketClass: "",
            ticketMode: "", // Category: "Single" | "Multiple"
            numberOfGuest: "",
            totalAllocation: "",
            amount: "",
        },
    });

    const ticketMode = useWatch({ control, name: "ticketMode" }); // Category
    const ticketClass = useWatch({ control, name: "ticketClass" });

    const isMultiple = ticketMode === "Multiple";
    const isSingle = ticketMode === "Single";

    // Define allowed classes based on category
    const ticketClassOptions = useMemo(() => {
        if (isSingle) {
            // Only allow Regular
            return [{ value: "Regular", label: "Regular" }];
        }

        // For Multiple: allow VIP, Table for 10 (optionally Regular too)
        return [
            { value: "Regular", label: "Regular" }, // remove this if you don't want Regular for Multiple
            { value: "VIP", label: "VIP" },
            { value: "Table for 10", label: "Table for 10" },
        ];
    }, [isSingle]);

    // Auto-fill + lock ticketClass when category is Single
    useEffect(() => {
        if (isSingle) {
            setValue("ticketClass", "Regular", {
                shouldValidate: true,
                shouldDirty: true,
            });
            clearErrors("ticketClass");
        } else {
            // If switching away from Single and currently "Regular", you can keep it or clear it.
            // If you prefer to force user selection for Multiple, uncomment below:
            // setValue("ticketClass", "", { shouldValidate: true, shouldDirty: true });
        }
    }, [isSingle, setValue, clearErrors]);

    const onSubmit = async (data) => {
        const payload = {
            eventId: event.eventId,
            eventType: event.eventType,
            eventName: event.eventName,
            emailAddress: event.emailAddress,
            description: event.slogan,
            amount: event.eventType === "Free" ? 1 : Number(data.amount),
            total: Number(data.totalAllocation),
            category: data.ticketMode, // Single / Multiple
            attendees: isMultiple ? Number(data.numberOfGuest) : 1,
            ticketClass: data.ticketClass, // Regular / VIP / Table for 10
        };

        try {
            const res = await mutateAsync(payload);
            alert(res.message);
            handleClose();
        } catch (e) {
            console.log(e);
            alert(e?.response?.data?.message || "An error occurred");
        }
    };

    return (
        <Modal title="Create Ticket" handleClose={handleClose}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Ticket Category (Single/Multiple) */}
                <Controller
                    name="ticketMode"
                    control={control}
                    rules={{ required: "Category is required" }}
                    render={({ field }) => (
                        <BaseSelect
                            label="Ticket Category"
                            {...field}
                            error={errors.ticketMode}
                            errorText={errors?.ticketMode?.message}
                        >
                            <option value=""></option>
                            <option value="Single">Single</option>
                            <option value="Multiple">Multiple</option>
                        </BaseSelect>
                    )}
                />

                {/* Ticket Class (Regular/VIP/Table for 10) */}
                <Controller
                    name="ticketClass"
                    control={control}
                    rules={{
                        required: "Ticket class is required",
                        validate: (val) => {
                            if (isSingle && val !== "Regular")
                                return "Single tickets must be Regular";
                            return true;
                        },
                    }}
                    render={({ field }) => (
                        <BaseSelect
                            label="Ticket Class"
                            {...field}
                            disabled={isSingle} // lock it when category is Single
                            error={errors.ticketClass}
                            errorText={errors?.ticketClass?.message}
                        >
                            <option value=""></option>
                            {ticketClassOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </BaseSelect>
                    )}
                />

                {/* Number of Guest (only for Multiple) */}
                {isMultiple && (
                    <Controller
                        name="numberOfGuest"
                        control={control}
                        rules={{
                            required: "Number of guest is required",
                            min: { value: 1, message: "Must be at least 1" },
                        }}
                        render={({ field }) => (
                            <BaseInput
                                label="Number of Guest"
                                type="number"
                                {...field}
                                error={errors.numberOfGuest}
                                errorText={errors.numberOfGuest?.message}
                            />
                        )}
                    />
                )}

                {/* Total Ticket Allocation */}
                <Controller
                    name="totalAllocation"
                    control={control}
                    rules={{
                        required: "Total ticket allocation is required",
                        min: { value: 1, message: "Must be at least 1" },
                    }}
                    render={({ field }) => (
                        <BaseInput
                            label="Total Ticket Allocation"
                            type="number"
                            {...field}
                            error={errors.totalAllocation}
                            errorText={errors.totalAllocation?.message}
                        />
                    )}
                />

                {/* Amount (only for Paid events) */}
                {event.eventType === "Paid" && (
                    <Controller
                        name="amount"
                        control={control}
                        rules={{
                            required: "Amount is required",
                            min: { value: 1, message: "Must be at least 1" },
                        }}
                        render={({ field }) => (
                            <BaseInput
                                label="Amount"
                                type="number"
                                {...field}
                                error={errors.amount}
                                errorText={errors.amount?.message}
                            />
                        )}
                    />
                )}

                <div className="pt-6">
                    <BaseButton
                        type="submit"
                        loading={isSubmitting || isPending}
                    >
                        Create Ticket
                    </BaseButton>
                </div>
            </form>
        </Modal>
    );
};
