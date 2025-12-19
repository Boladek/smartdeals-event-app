import { useEffect, useMemo, useState, useRef } from "react";
import { FaRegCopy, FaRedoAlt } from "react-icons/fa";
import { BaseButton } from "../../../components/BaseButton";
import { useWebSocket } from "../../../contexts/WebSocketContext";

export const BankTransferPaymentCard = ({
    handleClose,
    transaction,
    onRetry,
    onIHavePaid,
}) => {
    const { hasInitiationRef } = useWebSocket();

    const TEN_MINUTES = 30 * 60; // seconds
    const [secondsLeft, setSecondsLeft] = useState(TEN_MINUTES);

    const [isRetrying, setIsRetrying] = useState(false);

    // ✅ Payment detection state
    const [isConfirmed, setIsConfirmed] = useState(false);
    const confirmedOnceRef = useRef(false);

    // ✅ Copy states
    const [copiedAccount, setCopiedAccount] = useState(false);
    const [copiedAmount, setCopiedAmount] = useState(false);
    const [copiedTotal, setCopiedTotal] = useState(false);

    // Reset timer + states whenever transaction changes
    useEffect(() => {
        setSecondsLeft(TEN_MINUTES);
        setIsConfirmed(false);
        confirmedOnceRef.current = false;

        setCopiedAccount(false);
        setCopiedAmount(false);
        setCopiedTotal(false);
    }, [transaction?.reference, transaction?.transactionRef]);

    // Countdown
    useEffect(() => {
        if (secondsLeft <= 0) return;

        const t = setInterval(() => {
            setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
        }, 1000);

        return () => clearInterval(t);
    }, [secondsLeft]);

    const expired = secondsLeft <= 0;

    const timeText = useMemo(() => {
        const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
        const ss = String(secondsLeft % 60).padStart(2, "0");
        return `${mm}:${ss}`;
    }, [secondsLeft]);

    /**
     * ✅ Poll the websocket-fed Set every ~4 seconds.
     * We check initiationTranRef (because payment_status emits that).
     */
    useEffect(() => {
        if (expired) return;

        const initiationRef = transaction?.initiationTranRef;
        if (!initiationRef) return;

        if (isConfirmed) return;

        const intervalMs = 4000;

        const i = setInterval(() => {
            const found = hasInitiationRef(initiationRef);

            if (found) {
                setIsConfirmed(true);

                if (!confirmedOnceRef.current) {
                    confirmedOnceRef.current = true;
                    onIHavePaid("globalpay_bank_transfer"); // optional auto trigger
                }

                clearInterval(i);
            }
        }, intervalMs);

        return () => clearInterval(i);
    }, [
        expired,
        transaction?.initiationTranRef,
        hasInitiationRef,
        isConfirmed,
    ]);

    const copyText = async (text, onDone) => {
        try {
            await navigator.clipboard.writeText(String(text || ""));
            onDone?.();
        } catch (e) {
            alert("Could not copy. Please copy manually.");
        }
    };

    const copyAccountNumber = () =>
        copyText(transaction?.accountNumber, () => {
            setCopiedAccount(true);
            setTimeout(() => setCopiedAccount(false), 1400);
        });

    const copyAmount = (val) =>
        copyText(val, () => {
            setCopiedAmount(true);
            setCopiedTotal(false);
            setTimeout(() => setCopiedAmount(false), 1400);
        });

    const copyTotal = (val) =>
        copyText(val, () => {
            setCopiedTotal(true);
            setCopiedAmount(false);
            setTimeout(() => setCopiedTotal(false), 1400);
        });

    const handleRetry = async () => {
        try {
            setIsRetrying(true);
            await onRetry?.();
        } finally {
            setIsRetrying(false);
        }
    };

    const bankName = transaction?.bankName || "Providus Bank";
    const currency = transaction?.currency || "NGN";

    const amount = Number(transaction?.amount ?? 0);
    const fee = Number(transaction?.charge || 0);
    const total = amount + fee;

    const amountText = amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const totalText = transaction.actualAmount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return (
        <div>
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 grid place-items-center">
                        <span className="text-[11px] font-bold text-gray-600">
                            {bankName.split(" ")[0].slice(0, 3).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">
                            {bankName}
                        </p>
                        <p className="text-xs text-gray-500">
                            {transaction?.username || "Virtual Account"}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleRetry}
                    disabled={isRetrying}
                    className={[
                        "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold",
                        "hover:bg-gray-50 active:bg-gray-100 transition",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                    ].join(" ")}
                    title="Retry / Refresh account"
                >
                    <FaRedoAlt className={isRetrying ? "animate-spin" : ""} />
                    {isRetrying ? "Retrying..." : "Retry"}
                </button>
            </div>

            {/* Body */}
            <div className="space-y-4 mt-4">
                {/* Account Number */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold tracking-wide text-gray-400 uppercase">
                            Account Number
                        </p>
                        <p className="mt-2 text-3xl font-semibold text-gray-900">
                            {transaction?.accountNumber || "—"}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={copyAccountNumber}
                        className={[
                            "mt-6 h-10 w-10 rounded-xl grid place-items-center",
                            "border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition",
                        ].join(" ")}
                        aria-label="Copy account number"
                        title="Copy account number"
                    >
                        <FaRegCopy className="text-gray-600" />
                    </button>
                </div>

                {/* Account name */}
                <div>
                    <p className="text-xs font-bold tracking-wide text-gray-400 uppercase">
                        Account Name
                    </p>
                    <p className="mt-1 text-base font-semibold text-gray-900">
                        {transaction?.accountName || "—"}
                    </p>
                </div>

                {/* Bank */}
                <div>
                    <p className="text-xs font-bold tracking-wide text-gray-400 uppercase">
                        Bank Name
                    </p>
                    <p className="mt-1 text-base font-semibold text-gray-900">
                        {bankName}
                    </p>
                </div>

                {/* Amount row + Copy */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-xs font-bold tracking-wide text-gray-400 uppercase">
                            Amount ({currency})
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                            <p className="text-lg font-semibold text-gray-900">
                                {amountText}
                            </p>

                            <button
                                type="button"
                                onClick={() => copyAmount(amountText)}
                                className="h-8 w-8 rounded-lg grid place-items-center border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition"
                                aria-label="Copy amount"
                                title="Copy amount"
                            >
                                <FaRegCopy className="text-gray-600 text-sm" />
                            </button>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-xs font-bold tracking-wide text-gray-400 uppercase">
                            Fee ({currency})
                        </p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">
                            {fee.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </p>
                    </div>
                </div>

                {/* Total + Copy */}
                <div>
                    <p className="text-xs font-bold tracking-wide text-gray-400 uppercase">
                        Total Amount ({currency})
                    </p>

                    <div className="mt-1 flex items-center justify-between gap-3">
                        <p className="text-4xl font-semibold text-gray-900">
                            {totalText}
                        </p>

                        <button
                            type="button"
                            onClick={() => copyTotal(totalText)}
                            className="h-10 w-10 rounded-xl grid place-items-center border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition"
                            aria-label="Copy total amount"
                            title="Copy total amount"
                        >
                            <FaRegCopy className="text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Helper texts */}
                <div className="pt-1 text-center space-y-2">
                    {copiedAccount && (
                        <p className="text-xs font-semibold text-green-600">
                            Account number copied!
                        </p>
                    )}
                    {copiedAmount && (
                        <p className="text-xs font-semibold text-green-600">
                            Amount copied!
                        </p>
                    )}
                    {copiedTotal && (
                        <p className="text-xs font-semibold text-green-600">
                            Total amount copied!
                        </p>
                    )}

                    {isConfirmed && (
                        <p className="text-sm font-semibold text-green-700">
                            Payment confirmed ✅
                        </p>
                    )}

                    <p className="text-sm font-semibold text-[#E41F26]">
                        Use this account details for this transaction only.
                    </p>

                    {/* ✅ Description */}
                    <p className="text-xs text-gray-600">
                        Ensure you transfer total amount displayed including
                        transaction fee.
                    </p>

                    {/* ✅ Warning */}
                    <p className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                        Reversals for incorrect amount payments, less
                        transaction fees, will be processed within 5 business
                        days.
                    </p>

                    <p
                        className={[
                            "text-sm font-semibold",
                            expired ? "text-gray-400" : "text-[#E41F26]",
                        ].join(" ")}
                    >
                        {expired
                            ? "Account has expired. Please retry."
                            : `Account expires in ${timeText} minutes`}
                    </p>
                </div>

                {/* CTAs */}
                <div className="space-y-4">
                    <BaseButton
                        type="button"
                        onClick={() => onIHavePaid("globalpay_bank_transfer")}
                    >
                        I have made payment
                    </BaseButton>
                </div>
                <div className="space-y-4">
                    <BaseButton
                        type="button"
                        onClick={handleClose}
                        variant="outlined"
                    >
                        CANCEL
                    </BaseButton>
                </div>
            </div>
        </div>
    );
};
