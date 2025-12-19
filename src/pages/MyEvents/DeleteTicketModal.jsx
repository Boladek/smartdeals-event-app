import React, { useMemo } from "react";
import { Modal } from "../../components/Modal";
import { BaseButton } from "../../components/BaseButton";
import { useDeleteTicket } from "../../hooks/UserEventHooks"; // create this hook

const prettyCategory = (category) => {
    if (!category) return "-";
    const c = String(category).toLowerCase();
    if (c === "single") return "Single";
    if (c === "multiple") return "Multiple";
    return category;
};

const prettyClass = (ticketClass) => {
    if (!ticketClass) return "-";
    const t = String(ticketClass).trim().toLowerCase();
    if (t === "regular") return "Regular";
    if (t === "vip") return "VIP";
    if (t === "table for 10" || t === "tablefor10" || t === "table_for_10")
        return "Table for 10";
    return ticketClass;
};

const formatMoney = (value) => {
    const n = Number(value);
    if (Number.isNaN(n)) return String(value ?? "-");
    return n.toLocaleString();
};

export const DeleteTicketConfirmModal = ({
    handleClose,
    event,
    ticket,
    onDeleted,
}) => {
    const { mutateAsync, isPending } = useDeleteTicket();

    const summary = useMemo(() => {
        return [
            { label: "Event", value: event?.eventName || "-" },
            { label: "Ticket Class", value: prettyClass(ticket?.ticketClass) },
            { label: "Category", value: prettyCategory(ticket?.category) },
            { label: "Allocation", value: ticket?.total ?? "-" },
            { label: "Sold", value: ticket?.sold ?? "-" },
            { label: "Remaining", value: ticket?.remaining ?? "-" },
            {
                label: "Amount",
                value:
                    event?.eventType === "Free"
                        ? "Free"
                        : `₦${formatMoney(ticket?.amount)}`,
            },
        ];
    }, [event, ticket]);

    const onConfirmDelete = async () => {
        try {
            // Adjust payload to match your backend expectation
            const payload = {
                ID: ticket?.id,
                ticketId: ticket?.ticketId,
                eventId: event?.eventId,
            };

            const res = await mutateAsync(payload);
            alert(res?.message || "Ticket deleted successfully");

            onDeleted?.(); // e.g. refetch tickets
            handleClose?.();
        } catch (e) {
            console.log(e);
            alert(e?.response?.data?.message || "An error occurred");
        }
    };

    return (
        <Modal title="Delete Ticket" handleClose={handleClose} maxWidth={520}>
            <div className="space-y-5">
                {/* Warning text */}
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-700 font-medium">
                        Are you sure you want to delete this ticket?
                    </p>
                    <p className="mt-1 text-xs text-red-600">
                        This action cannot be undone.
                    </p>
                </div>

                {/* Ticket Summary */}
                <div className="rounded-2xl bg-gray-50 p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                        Ticket summary
                    </h4>

                    <div className="space-y-2">
                        {summary.map((item) => (
                            <div
                                key={item.label}
                                className="flex items-start justify-between gap-4"
                            >
                                <span className="text-xs text-gray-500">
                                    {item.label}
                                </span>
                                <span className="text-xs font-semibold text-gray-900 text-right">
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="w-full rounded-2xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                        disabled={isPending}
                    >
                        Cancel
                    </button>

                    <BaseButton
                        type="button"
                        loading={isPending}
                        onClick={onConfirmDelete}
                        className="w-full !rounded-2xl !py-3 !bg-[#E41F26] hover:!bg-[#E41F26]/90"
                    >
                        Yes, Delete Ticket
                    </BaseButton>
                </div>
            </div>
        </Modal>
    );
};
