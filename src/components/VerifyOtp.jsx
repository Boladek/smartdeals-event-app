import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSendOtp, useVerifyOtp } from "../hooks";
import OtpInput from "react-otp-input";
import WhiteSpinner from "./WhiteSpinner";
import { BaseButton } from "./BaseButton";
import { hashPassword } from "../helpers/encryption";
import customAxios from "../helpers/customAxios";
// import customAxios from "../helpers/customAxios";

const RESEND_WAIT_SECONDS = 5 * 60; // 5 minutes

export function VerifyOTP({ formData, handleOtp, handleClose }) {
    const { mutateAsync, isPending } = useVerifyOtp();
    const { mutateAsync: sendOtp } = useSendOtp();
    const [otp, setOtp] = useState("");
    const [counter, setCounter] = useState(RESEND_WAIT_SECONDS);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (counter <= 0) return;

        const timer = setInterval(() => {
            setCounter((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [counter]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, "0")}:${s
            .toString()
            .padStart(2, "0")}`;
    };

    const canResend = counter === 0 && !sendingOtp;

    const handleResendOtp = async () => {
        if (!canResend) return;

        await sendOtp({
            emailAddress: formData.emailAddress,
            fullName: `${formData.firstName} ${formData.lastName}`,
            accountType: formData.accountType,
            username: formData.username,
            phoneNumber: formData.phoneNumber,
        });
        setCounter(RESEND_WAIT_SECONDS);
    };

    const verifyOtp = async () => {
        try {
            if (!otp || otp.length < 6) return;
            setLoading(true);
            await mutateAsync({
                otp: hashPassword({
                    username: formData.username,
                    password: otp,
                }).finalHash,
                emailAddress: formData?.emailAddress,
                accountType: formData?.accountType,
                username: formData?.username,
            });
            await customAxios.post("/customer/onboardAccount", {
                ...formData,
                otp: hashPassword({
                    username: formData.username,
                    password: otp,
                }).finalHash,
            });
            handleClose();
        } catch (error) {
            console.log(error);
            alert(error?.response?.data?.message || "An Error occured");
        } finally {
            setLoading(false);
        }

        // customAxios
        //     .post("/wallet/transfer", {
        //         payload: encrypt({
        //             ...formData,
        //             otp: otp,
        //             twoFactorToken: otp,
        //         }),
        //     })
        //     .then((res) => {
        //         showToastSuccess(res.message);
        //         gotoNext();
        //         refetchWalletBalance();
        //     })
        //     .catch((err) => UseError(err))
        //     .finally(() => setLoading(false));
    };

    return (
        <div className="grid grid-cols-1 gap-4">
            <div className="text-center grid grid-cols-1 gap-2">
                <p className="text-xs">
                    We sent an OTP to{" "}
                    <span className="text-primary font-[500]">
                        {formData?.emailAddress}
                    </span>
                    . Please enter the OTP below.
                </p>
            </div>

            <div className="flex justify-center items-center py-2 flex-col gap-1 w-full">
                <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderInput={(props) => (
                        <input
                            {...props}
                            style={{
                                width: "3rem",
                                height: "3rem",
                                border: "1px solid rgba(0,0,0,0.3)",
                            }}
                            className="w-12 h-12 text-center p-2 rounded-lg focus:ring-2 focus:ring-[#675DB0] focus:border-transparent text-primary"
                            required
                            type="number"
                        />
                    )}
                    containerStyle="flex gap-2"
                />
            </div>

            <div className="flex items-center text-[11px] gap-1 justify-center text-gray-400">
                Did not receive any OTP?
                {counter > 0 ? (
                    <span className="font-[600] text-gray-500">
                        Resend in {formatTime(counter)}
                    </span>
                ) : (
                    <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={!canResend}
                        className="font-[700] hover:underline cursor-pointer text-primary disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Resend OTP
                    </button>
                )}
            </div>

            <div className="w-full flex justify-center">
                <BaseButton
                    onClick={verifyOtp}
                    disabled={isPending || otp.length < 6}
                >
                    {loading ? <WhiteSpinner /> : "Verify OTP"}
                </BaseButton>
            </div>
        </div>
    );
}

VerifyOTP.propTypes = {
    gotoNext: PropTypes.func.isRequired,
    formData: PropTypes.object.isRequired,
};
