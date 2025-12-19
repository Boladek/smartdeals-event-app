import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Modal } from "../../components/Modal";
import { BaseInput } from "../../components/BaseInput";
import { UseAuth } from "../../contexts/AuthContext";

export const GuestForm = ({ total, handleClose, handleGuests, guests }) => {
    const { isLoggedIn, user } = UseAuth();

    const {
        control,
        handleSubmit,
        formState: { errors },
        register,
        setValue,
        reset, // We'll use reset to update default values dynamically
    } = useForm({
        defaultValues: {
            guests: Array.from({ length: total }, () => ({
                fullName: "",
                emailAddress: "",
            })),
        },
    });

    // Effect to update defaultValues when guests prop is available
    useEffect(() => {
        if (guests.length > 0) {
            const guestData = guests.map((guest) => ({
                fullName: guest.fullName || "",
                emailAddress: guest.emailAddress || "",
            }));
            reset({ guests: guestData }); // Reset form data with guests' info
        }
    }, [guests, reset]);

    const onSubmit = (data) => {
        handleGuests(data.guests);
        handleClose();
    };

    const handleUseDefaultToggle = (index, checked) => {
        if (checked) {
            setValue(`guests.${index}.fullName`, user.fullName);
            setValue(`guests.${index}.emailAddress`, user.emailAddress);
        } else {
            setValue(`guests.${index}.fullName`, "");
            setValue(`guests.${index}.emailAddress`, "");
        }
    };

    return (
        <Modal title="Add Guest" handleClose={handleClose} maxWidth={600}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="border-b border-gray-300 mb-4">
                    <h3 className="text-lg font-semibold">GUEST {total}</h3>
                </div>

                {/* List of Guests */}
                <div className="space-y-6">
                    <Controller
                        name="guests"
                        control={control}
                        render={({ field }) => (
                            <>
                                {field.value.map((guest, index) => (
                                    <div
                                        key={index}
                                        className="space-y-3 border border-gray-200 rounded-md p-3"
                                    >
                                        {isLoggedIn && (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id={`use-default-${index}`}
                                                    className="h-4 w-4 accent-primary"
                                                    onChange={(e) =>
                                                        handleUseDefaultToggle(
                                                            index,
                                                            e.target.checked
                                                        )
                                                    }
                                                    checked={
                                                        user.emailAddress ===
                                                        guest.email
                                                    }
                                                />
                                                <label
                                                    htmlFor={`use-default-${index}`}
                                                    className="text-sm text-gray-700"
                                                >
                                                    Is me
                                                </label>
                                            </div>
                                        )}
                                        <div className="flex gap-4">
                                            <BaseInput
                                                label={`Name of Attendant ${
                                                    index + 1
                                                }`}
                                                {...register(
                                                    `guests[${index}].fullName`,
                                                    {
                                                        required:
                                                            "Name is required",
                                                    }
                                                )}
                                                error={
                                                    errors.guests &&
                                                    errors.guests[index]
                                                        ?.fullName
                                                }
                                                errorText={
                                                    errors.guests &&
                                                    errors.guests[index]
                                                        ?.fullName &&
                                                    errors.guests[index]
                                                        ?.fullName.message
                                                }
                                            />

                                            <BaseInput
                                                type="email"
                                                label={`Email Address ${
                                                    index + 1
                                                }`}
                                                {...register(
                                                    `guests[${index}].emailAddress`,
                                                    {
                                                        required:
                                                            "Email is required",
                                                    }
                                                )}
                                                error={
                                                    errors.guests &&
                                                    errors.guests[index]
                                                        ?.emailAddress
                                                }
                                                errorText={
                                                    errors.guests &&
                                                    errors.guests[index]
                                                        ?.emailAddress &&
                                                    errors.guests[index]
                                                        ?.emailAddress.message
                                                }
                                            />
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full p-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
                >
                    Save Guest
                </button>
            </form>
        </Modal>
    );
};
