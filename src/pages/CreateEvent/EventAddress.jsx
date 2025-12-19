import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { BaseInput } from "../../components/BaseInput";
import { LocationPicker } from "../../components/LocationPicker";
import { useGetCountries, useGetStates } from "../../hooks/EventsHooks";
import { CustomSelect } from "../../components/CustomSelect";

const EventAddress = ({ control, errors, setValue, watch }) => {
    const watchCountry = watch("country");
    const watchCountryId = watch("countryId");
    const watchAddress = watch("address");
    const watchLatitude = watch("latitude");
    const watchLongitude = watch("longitude");
    const watchVirtual = watch("virtual");

    const { data: countries = [], isLoading: gettingCountries } =
        useGetCountries();
    const { data: states, isLoading: gettingStates } = useGetStates({
        countryID: watchCountryId,
    });

    useEffect(() => {
        if (watchCountry && countries.length > 0) {
            setValue(
                "countryId",
                countries?.find((item) => item.name === watchCountry)?.ID
            );
        }
    }, [setValue, watchCountry, states]);

    return (
        <>
            <Controller
                name="virtual"
                control={control}
                render={({ field }) => (
                    <div className="flex text-sm gap-2 items-center">
                        <input
                            type="checkbox"
                            id="virtual"
                            className="accent-primary h-4 w-4"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                        />
                        <label htmlFor="perpetual">Virtual</label>
                    </div>
                )}
            />

            {watchVirtual === true && (
                <Controller
                    name="meetingLink"
                    control={control}
                    rules={{
                        required: "Meeting link is required",
                        pattern: {
                            value: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i, // Regex for validating a URL
                            message: "Please enter a valid URL", // Custom error message for invalid URL
                        },
                    }}
                    render={({ field }) => (
                        <BaseInput
                            label="Meeting Link"
                            {...field}
                            error={errors.meetingLink}
                            errorText={errors.meetingLink?.message}
                        />
                    )}
                />
            )}

            {watchVirtual !== true && (
                <>
                    <CustomSelect
                        label="Country"
                        name="country"
                        id="country"
                        control={control}
                        options={
                            countries?.map((item) => ({
                                value: item.name,
                                label: item.name,
                            })) ?? []
                        }
                        error={!!errors.country}
                        errorText={errors.country?.message}
                        rules={{ required: "Country is required" }}
                        isLoading={gettingCountries}
                    />

                    <CustomSelect
                        label="State"
                        name="state"
                        id="state"
                        control={control}
                        options={
                            states?.map((item) => ({
                                value: item.name,
                                label: item.name,
                            })) ?? []
                        }
                        isLoading={gettingStates}
                        error={!!errors.state}
                        errorText={errors.state?.message}
                        rules={{ required: "State is Required" }}
                    />

                    <LocationPicker
                        control={control}
                        setValue={setValue}
                        errors={errors}
                        addressName="address"
                        latName="latitude"
                        lngName="longitude"
                        label="Address"
                        addressValue={watchAddress}
                        latValue={watchLatitude}
                        lngValue={watchLongitude}
                    />
                </>
            )}

            <Controller
                name="venue"
                control={control}
                rules={{ required: "Venue is required" }}
                render={({ field }) => (
                    <BaseInput
                        label="Venue"
                        {...field}
                        error={errors.venue}
                        errorText={errors.venue?.message}
                    />
                )}
            />
        </>
    );
};

export default EventAddress;
