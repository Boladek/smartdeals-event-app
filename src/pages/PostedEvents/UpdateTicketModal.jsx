import React, { useEffect, useMemo } from "react";
import { Controller, useWatch, useForm } from "react-hook-form";
import { Modal } from "../../components/Modal";
import { BaseInput } from "../../components/BaseInput";
import { BaseButton } from "../../components/BaseButton";
import { BaseSelect } from "../../components/BaseSelect";
import { useEditTicket } from "../../hooks/UserEventHooks"; // <-- create this hook

const normalizeCategory = (category) => {
    if (!category) return "";
    const c = String(category).toLowerCase();
    if (c === "single") return "Single";
    if (c === "multiple") return "Multiple";
    return "";
};

const normalizeTicketClass = (ticketClass) => {
    if (!ticketClass) return "";
    const t = String(ticketClass).trim().toLowerCase();

    if (t === "regular") return "Regular";
    if (t === "vip") return "VIP";

    // handle TABLE FOR 10 variants
    if (t === "table for 10" || t === "tablefor10" || t === "table_for_10") {
        return "Table for 10";
    }

    return "";
};

export const UpdateTicketForm = ({ handleClose, event, ticket }) => {
    const { mutateAsync, isPending } = useEditTicket();

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting },
        clearErrors,
    } = useForm({
        defaultValues: {
            ticketClass: "",
            ticketMode: "",
            numberOfGuest: "",
            totalAllocation: "",
            amount: "",
        },
    });

    const ticketMode = useWatch({ control, name: "ticketMode" });
    const isMultiple = ticketMode === "Multiple";
    const isSingle = ticketMode === "Single";

    // Prefill when modal opens / ticket changes
    useEffect(() => {
        if (!ticket) return;

        reset({
            ticketClass: normalizeTicketClass(ticket.ticketClass),
            ticketMode: normalizeCategory(ticket.category),
            numberOfGuest: ticket.attendees ?? "",
            totalAllocation: ticket.total ?? "",
            amount: ticket.amount ?? "",
        });
    }, [ticket, reset]);

    // Ticket class options based on category
    const ticketClassOptions = useMemo(() => {
        if (isSingle) return [{ value: "Regular", label: "Regular" }];

        return [
            { value: "Regular", label: "Regular" }, // remove if you don't want Regular for Multiple
            { value: "VIP", label: "VIP" },
            { value: "Table for 10", label: "Table for 10" },
        ];
    }, [isSingle]);

    // Auto-fill + lock ticketClass when Single
    useEffect(() => {
        if (isSingle) {
            setValue("ticketClass", "Regular", {
                shouldValidate: true,
                shouldDirty: true,
            });
            clearErrors("ticketClass");
        }
    }, [isSingle, setValue, clearErrors]);

    const onSubmit = async (data) => {
        const payload = {
            // identifiers (likely required for update)
            ID: ticket?.id,
            ticketId: ticket?.ticketId,

            // event info
            eventId: event?.eventId,
            eventType: event?.eventType,
            eventName: event?.eventName,
            emailAddress: event?.emailAddress,
            description: event?.slogan,

            // ticket fields
            amount: event?.eventType === "Free" ? 1 : Number(data.amount),
            total: Number(data.totalAllocation),
            category: data.ticketMode, // Single/Multiple
            attendees: isMultiple ? Number(data.numberOfGuest) : 1,
            ticketClass: data.ticketClass, // Regular/VIP/Table for 10
        };

        try {
            const res = await mutateAsync(payload);
            alert(res?.message || "Ticket updated successfully");
            handleClose();
        } catch (e) {
            console.log(e);
            alert(e?.response?.data?.message || "An error occurred");
        }
    };

    return (
        <Modal title="Update Ticket" handleClose={handleClose}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Ticket Category */}
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

                {/* Ticket Class */}
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
                            disabled={isSingle}
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

                {/* Number of Guest (Multiple only) */}
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

                {/* Total Allocation */}
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

                {/* Amount (Paid only) */}
                {event?.eventType === "Paid" && (
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
                        Update Ticket
                    </BaseButton>
                </div>
            </form>
        </Modal>
    );
};
