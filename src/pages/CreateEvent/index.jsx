import React, { useState } from "react";
import { useForm } from "react-hook-form";
import EventName from "./EventName";
import EventDate from "./EventDate";
import EventAddress from "./EventAddress";
import EventCategory from "./EventCategory";
import EventDetails from "./EventDetails";
import BannerUploadStep from "./BannerUploadStep"; // Import the BannerUploadStep component
import { useCreateEvent } from "../../hooks/EventsHooks";
import { SuccessPage } from "./SuccessPage";
import { BackButton } from "../../components/BackButton";
import { useNavigate } from "react-router";

function CreateEventPage() {
    const navigate = useNavigate();
    const { mutateAsync, isPending } = useCreateEvent();
    const [currentStep, setCurrentStep] = useState(5); // Start from step 1

    const {
        control,
        handleSubmit,
        formState: { errors },
        trigger,
        setValue,
        watch,
        getValues,
        reset,
    } = useForm({
        defaultValues: {
            venue: "",
            country: "",
            state: "",
            address: "",
            eventDate: "",
            eventTime: "",
            eventCategory: "",
            eventClass: "",
            eventName: "",
            description: "",
            longitude: "",
            latitude: "",
            banners: [null, null, null], // Adding banners as part of default values
        },
    });

    const onSubmit = async (data) => {
        try {
            if (currentStep === 6) {
                await mutateAsync({
                    venue: data.venue,
                    state: data.state,
                    country: data.country,
                    perpetual: data.perpetual ? 1 : 0,
                    virtual: data.virtual ? 1 : 0,
                    eventClass: data.eventClass,
                    address: data.address || data.meetingLink,
                    eventDate: data.eventDate,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    eventCategory: data.eventCategory,
                    eventType: data.eventType,
                    eventName: data.eventName,
                    slogan: data.description,
                    longitude: data.longitude,
                    latitude: data.latitude,
                    files: data.banners,
                });
                reset();
                setCurrentStep(7);
            }
        } catch (error) {
            console.log(error);
            alert(error.response.data.message);
        }
        // Handle the final submission here (send to API, etc.)
    };

    const nextStep = async () => {
        // Validate the current step
        const isValid = await trigger();
        if (currentStep === 5) {
            const images = getValues("banners");
            if (images.filter(Boolean).length === 0) {
                alert("Atleast one image must be uploaded");
                return;
            }
        }

        if (isValid) {
            setCurrentStep((prevStep) => Math.min(prevStep + 1, 6)); // Adjust max step (now 6 for Banner)
        }
    };

    const prevStep = () => {
        setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return <EventName control={control} errors={errors} />;
            case 2:
                return <EventCategory control={control} errors={errors} />;
            case 3:
                return (
                    <EventAddress
                        control={control}
                        errors={errors}
                        watch={watch}
                        setValue={setValue}
                    />
                );
            case 5:
                return (
                    <BannerUploadStep
                        setValue={setValue}
                        watch={watch}
                        onFinish={nextStep}
                    />
                ); // Render BannerUploadStep on step 4
            case 4:
                return (
                    <EventDate
                        control={control}
                        errors={errors}
                        watch={watch}
                    />
                );
            case 6:
                return <EventDetails data={watch()} />;
            case 7:
                return <SuccessPage />;
            default:
                return null;
        }
    };

    const getStepTitle = () => {
        switch (currentStep) {
            case 1:
                return "Tell us about the event";
            case 2:
                return "What Category does it belong to";
            case 3:
                return "Where is the event taking place";
            case 5:
                return "Upload Banners"; // New title for the banner upload step
            case 4:
                return "Fix the Date and Time";
            case 6:
                return "Review Your Event Details";
            default:
                return "";
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            prevStep();
        } else {
            navigate("/dashboard");
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-3">
            <BackButton onClick={handleBack} />
            <h1 className="text-3xl font-bold mb-6">{getStepTitle()}</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault(); // always block native submit
                }}
                className="space-y-6 max-w-xl"
            >
                {renderStepContent()}

                <div className="flex justify-between mt-6">
                    {currentStep <= 6 && (
                        <>
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="px-4 py-2 bg-gray-300 text-black rounded-md"
                                >
                                    Back
                                </button>
                            )}
                            {currentStep < 6 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    disabled={isPending}
                                    onClick={handleSubmit(onSubmit)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md"
                                >
                                    {isPending
                                        ? "Creating Event"
                                        : "Finish Creation"}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </form>
        </div>
    );
}

export default CreateEventPage;
