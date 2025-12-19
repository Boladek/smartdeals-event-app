import { useState } from "react";
import { Modal } from "../../../components/Modal";
import { PaymentCard } from "./PaymentCard";
import { useLocation } from "react-router"; // ✅ common correct import
import { BankTransferPaymentCard } from "./BankTransferPaymentCard";
import { SuccessPage } from "../../CreateEvent/SuccessPage";
import {
    useBuyTicket,
    useBuyTicketGuest,
    useEventPaymentDetails,
    useEventPaymentDetailsGuest,
    usePayWithSmartDeals,
} from "../../../hooks/EventsHooks";
import { UseAuth } from "../../../contexts/AuthContext";
import { Overlay } from "../../../components/Overlay";
import { generateEventId } from "../../../helpers/functions";

export function EventPayment({
    handleClose,
    guests,
    selectedTicket,
    attendees,
}) {
    const { isLoggedIn, user } = UseAuth();
    const location = useLocation();
    const event = location.state?.event || {};

    const [step, setStep] = useState(1);
    const [transactionDetails, setTransactionDetails] = useState(null);

    const { mutateAsync: payForEvent, isPending: gettingPaymentDetails } =
        useEventPaymentDetails();
    const {
        mutateAsync: payForEventGuest,
        isPending: gettingPaymentDetailsGuest,
    } = useEventPaymentDetailsGuest();

    const { mutateAsync: buyTicket, isPending: buyingTicket } = useBuyTicket();
    const { mutateAsync: buyTicketGuest, isPending: buyingTicketGuest } =
        useBuyTicketGuest();

    const { mutateAsync: payWithSmartDeals, isPending: payingWithSmartDeals } =
        usePayWithSmartDeals();

    const handleTransaction = (data, nextStep = 2) => {
        setTransactionDetails(data);
        setStep(nextStep);
    };

    const handleBuy = async (channel, transactionId = "") => {
        try {
            // ✅ Guard: channel must be provided
            if (!channel) throw new Error("Payment channel not specified");

            if (isLoggedIn) {
                await buyTicket({
                    attendees: guests,
                    eventId: event.eventId,
                    eventName: event.eventName,
                    eventDate: event.eventDate,
                    eventType: event.eventType,
                    eventClass: event.eventClass,
                    eventVenue: event.venue,
                    ticketClass: selectedTicket?.ticketClass,
                    ticketId: selectedTicket?.ticketId,
                    amount: Number(selectedTicket?.amount || 0),
                    quantity: attendees,
                    channel,
                    transactionId,

                    // ✅ Only present for transfer
                    initiationTranRef: transactionDetails?.initiationTranRef,
                    accountNumber: transactionDetails?.accountNumber,
                    actualAmount: transactionDetails?.actualAmount,
                    assignedDate: transactionDetails?.assignedDate,
                    releaseDate: transactionDetails?.releaseDate,
                    transactionRef: transactionDetails?.transactionRef,
                });
            } else {
                await buyTicketGuest({
                    attendees: guests,
                    eventId: event.eventId,
                    eventName: event.eventName,
                    eventDate: event.eventDate,
                    eventType: event.eventType,
                    eventClass: event.eventClass,
                    eventVenue: event.venue,
                    ticketClass: selectedTicket?.ticketClass,
                    ticketId: selectedTicket?.ticketId,
                    amount: Number(selectedTicket?.amount || 0),
                    quantity: attendees,

                    // ✅ safe optional chaining
                    initiationTranRef: transactionDetails?.initiationTranRef,
                    channel,
                });
            }

            setStep(3);
        } catch (error) {
            alert(
                error?.response?.data?.message ||
                    error?.message ||
                    "Error buying ticket"
            );
        }
    };

    const initiatePayment = async (method) => {
        try {
            if (!selectedTicket?.ticketId)
                throw new Error("Ticket not selected");

            if (method === "globalpay_bank_transfer") {
                if (isLoggedIn) {
                    return await payForEvent({
                        eventType: event.eventType,
                        eventId: event.eventId,
                        process: "event",
                        eventName: event.eventName,
                        ticketClass: selectedTicket.ticketClass,
                        ticketId: selectedTicket.ticketId,
                        amount: Number(selectedTicket.amount),
                        attendees: guests,
                        quantity: attendees,
                        username: user?.username,
                        fullName: user?.fullName,
                        emailAddress: user?.emailAddress,
                        phoneNumber: user?.phoneNumber,
                    });
                }

                return await payForEventGuest({
                    eventType: event.eventType,
                    eventId: event.eventId,
                    process: "event",
                    eventName: event.eventName,
                    ticketClass: selectedTicket.ticketClass,
                    ticketId: selectedTicket.ticketId,
                    amount: Number(selectedTicket.amount),
                    attendees: guests,
                    quantity: attendees,
                });
            }

            const transactionId = generateEventId();

            await payWithSmartDeals({
                eventType: event.eventType,
                eventId: event.eventId,
                process: "event",
                eventName: event.eventName,
                ticketClass: selectedTicket.ticketClass,
                ticketId: selectedTicket.ticketId,
                amount: String(selectedTicket.amount),
                attendees: guests,
                quantity: attendees,
                transactionId,
                partnerId: "event",
                customerId: user?.username,
                settlementType: "wallet",
                narration: `Payment for eventName - ${event.eventName}`,
            });
            await handleBuy("wallet", transactionId);
        } catch (error) {
            alert(
                error?.response?.data?.message ||
                    error?.message ||
                    "Error paying for event"
            );
            return null;
        }
    };

    return (
        <Modal handleClose={handleClose} title="Event Payment">
            {(buyingTicketGuest || buyingTicket) && <Overlay />}

            {step === 1 && (
                <PaymentCard
                    attendees={attendees}
                    event={event}
                    intiatePayment={initiatePayment} // ✅ ensure PaymentCard expects this name
                    selectedTicket={selectedTicket}
                    handleTransaction={handleTransaction}
                    loading={
                        gettingPaymentDetails ||
                        payingWithSmartDeals ||
                        gettingPaymentDetailsGuest
                    }
                />
            )}

            {step === 2 && (
                <BankTransferPaymentCard
                    handleClose={handleClose}
                    transaction={transactionDetails}
                    onIHavePaid={() => handleBuy("globalpay_bank_transfer")}
                    onRetry={() => initiatePayment("globalpay_bank_transfer")}
                />
            )}

            {step === 3 && (
                <SuccessPage
                    message="Payment successful"
                    description="Ticket(s) will be sent to the entered email address"
                    link="/dashboard"
                />
            )}
        </Modal>
    );
}
