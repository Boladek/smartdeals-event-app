import { useState } from "react";
import { BaseButton } from "../../../components/BaseButton";
import { UseAuth } from "../../../contexts/AuthContext";
import { FaWallet, FaUniversity, FaCheckCircle } from "react-icons/fa";
import { formatNumber } from "../../../helpers/functions";

export const PaymentCard = ({
    selectedTicket,
    event,
    handleTransaction,
    intiatePayment,
    loading,
    attendees,
}) => {
    const { isLoggedIn, user } = UseAuth();

    const [paymentMethod, setPaymentMethod] = useState(
        "globalpay_bank_transfer"
    ); // wallet | transfer

    const amount = Number(selectedTicket?.amount || 0) * attendees;
    const walletBalance = Number(user?.walletBalance || 0);
    const hasEnoughWalletBalance = walletBalance >= amount;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await intiatePayment(paymentMethod);
        if (paymentMethod === "globalpay_bank_transfer") {
            handleTransaction(res.data, 2);
        } else {
            handleTransaction(res.data, 3);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* ================= PAYABLE AMOUNT ================= */}
            <div className="text-center">
                <p className="text-[16px] font-semibold text-[#3030304A]">
                    Payable Amount
                </p>

                <div className="text-4xl font-bold text-gray-900">
                    ₦{formatNumber(amount, 2)}
                </div>
            </div>

            {/* ================= EVENT OWNER ================= */}
            <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Event Owner</span>
                <span className="font-semibold text-gray-900">
                    {event.partnerName}
                </span>
            </div>

            {/* ================= PAYMENT METHOD ================= */}
            <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700">
                    Payment Method
                </p>

                {/* Wallet */}
                {isLoggedIn && (
                    <button
                        type="button"
                        onClick={() =>
                            hasEnoughWalletBalance && setPaymentMethod("wallet")
                        }
                        disabled={!hasEnoughWalletBalance}
                        className={[
                            "w-full flex items-center justify-between gap-4 p-4 rounded-xl border transition",
                            paymentMethod === "wallet"
                                ? "border-primary bg-primary/5"
                                : "border-gray-200 hover:bg-gray-50",
                            !hasEnoughWalletBalance
                                ? "opacity-50 cursor-not-allowed"
                                : "",
                        ].join(" ")}
                    >
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gray-100 grid place-items-center">
                                <FaWallet className="text-primary text-lg" />
                            </div>

                            <div className="text-left">
                                <p className="text-sm font-semibold text-gray-900">
                                    Wallet
                                </p>
                                <p className="text-xs text-gray-500">
                                    Balance: ₦{formatNumber(walletBalance, 2)}
                                </p>
                            </div>
                        </div>

                        {paymentMethod === "wallet" && (
                            <FaCheckCircle className="text-primary text-lg" />
                        )}
                    </button>
                )}

                {/* Bank Transfer */}
                <button
                    type="button"
                    onClick={() => setPaymentMethod("globalpay_bank_transfer")}
                    className={[
                        "w-full flex items-center justify-between gap-4 p-4 rounded-xl border transition",
                        paymentMethod === "globalpay_bank_transfer"
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:bg-gray-50",
                    ].join(" ")}
                >
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-100 grid place-items-center">
                            <FaUniversity className="text-primary text-lg" />
                        </div>

                        <div className="text-left">
                            <p className="text-sm font-semibold text-gray-900">
                                Bank Transfer
                            </p>
                            <p className="text-xs text-gray-500">
                                Pay via virtual account
                            </p>
                        </div>
                    </div>

                    {paymentMethod === "globalpay_bank_transfer" && (
                        <FaCheckCircle className="text-primary text-lg" />
                    )}
                </button>
            </div>

            {/* ================= CTA ================= */}
            <BaseButton
                loading={loading}
                disabled={paymentMethod === "wallet" && !hasEnoughWalletBalance}
            >
                Pay
            </BaseButton>

            {/* Helper text */}
            {paymentMethod === "wallet" && !hasEnoughWalletBalance && (
                <p className="text-xs text-red-600 text-center">
                    Insufficient wallet balance. Please choose bank transfer.
                </p>
            )}
        </form>
    );
};
