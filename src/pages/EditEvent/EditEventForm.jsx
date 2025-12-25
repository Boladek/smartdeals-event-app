import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { BaseInput } from "../../components/BaseInput";
import { BaseSelect } from "../../components/BaseSelect";
import { BaseButton } from "../../components/BaseButton";

import { LocationPicker } from "../../components/LocationPicker";
import { CustomSelect } from "../../components/CustomSelect";

import {
    useGetCountries,
    useGetStates,
    useGetEventByCategory,
    useGetEventClass,
    useGetEventType,
} from "../../hooks/EventsHooks";
import { useEditEvent } from "../../hooks/UserEventHooks";
import BannerCard from "../CreateEvent/BannerCard";

// ---------- helpers ----------
const toBool = (val) => Number(val) === 1;

const parseTimeToHHmm = (t) => {
    if (!t) return "";
    const s = String(t).trim();

    // already HH:mm
    if (/^\d{2}:\d{2}$/.test(s)) return s;

    // "08:00 AM"
    const m = s.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!m) return "";

    let hh = Number(m[1]);
    const mm = m[2];
    const ap = m[3].toUpperCase();

    if (ap === "AM") {
        if (hh === 12) hh = 0;
    } else {
        if (hh !== 12) hh += 12;
    }

    return `${String(hh).padStart(2, "0")}:${mm}`;
};

const hhmmTo12h = (hhmm) => {
    if (!hhmm) return "";
    const [hStr, mStr] = hhmm.split(":");
    let h = Number(hStr);
    const m = Number(mStr);
    const ap = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ap}`;
};

const normalizeBannerArray = (arr, size = 4) => {
    const a = Array.isArray(arr) ? [...arr] : [];
    while (a.length < size) a.push(null);
    return a.slice(0, size);
};

const isValidUrl = (val) => {
    if (!val) return true;
    try {
        const u = new URL(val);
        return u.protocol === "http:" || u.protocol === "https:";
    } catch {
        return false;
    }
};

/**
 * Resolve a value to a code from a list of {code, name/name_}
 * - supports passing codes directly
 * - supports passing names (Music, Free, public, etc.)
 */
const resolveCode = (list = [], value) => {
    if (!value) return "";

    // already a code?
    const byCode = list.find(
        (item) =>
            String(item.code).toLowerCase() === String(value).toLowerCase()
    );
    if (byCode) return byCode.code;

    // match by name / name_
    const byName = list.find((item) => {
        const n1 = String(item.name || "")
            .toLowerCase()
            .trim();
        const n2 = String(item.name_ || "")
            .toLowerCase()
            .trim();
        const v = String(value).toLowerCase().trim();
        return n1 === v || n2 === v;
    });

    return byName?.code || "";
};

// ---------- component ----------
/**
 * EditEventForm
 * - Uses LocationPicker for address + lat/lng (same as create)
 * - Uses Event Category details section with fetched codes (same as create)
 * - Prefills from `event` prop
 * - Validates with react-hook-form
 * - Payload matches your createEvent mutation shape (+ eventId/id for update)
 */
export const EditEventForm = ({ event }) => {
    const navigate = useNavigate();

    const { mutateAsync: editEvent, isPending } = useEditEvent();

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            // core
            eventName: "",
            description: "", // maps to slogan on submit
            eventType: "",
            eventClass: "",
            eventCategory: "",

            // location
            venue: "",
            address: "",
            meetingLink: "",
            state: "",
            country: "",
            countryId: "",
            latitude: "",
            longitude: "",

            // date/time
            eventDate: "",
            startTime: "", // HH:mm
            endTime: "", // HH:mm

            // flags
            perpetual: false,
            virtual: false,

            // media (optional)
            banners: [],

            // socials (optional)
            website: "",
            igHandle: "",
            twitterHandle: "",
            facebookHandle: "",
            snapchat: "",
            tiktok: "",
        },
    });

    // ===== watches (same pattern as your create components) =====
    const watchVirtual = watch("virtual");
    const watchCountry = watch("country");
    const watchCountryId = watch("countryId");
    const watchAddress = watch("address");
    const watchLatitude = watch("latitude");
    const watchLongitude = watch("longitude");
    const watchPerpetual = watch("perpetual");
    const startTimeVal = watch("startTime");
    const watchBanners = watch("banners");

    // ===== data for address section (same hooks as create) =====
    const { data: countries = [], isLoading: gettingCountries } =
        useGetCountries();

    const { data: states = [], isLoading: gettingStates } = useGetStates({
        countryID: watchCountryId,
    });

    // ===== data for category section (same hooks as create) =====
    const { data: eventCategories = [], isLoading: gettingEventCategory } =
        useGetEventByCategory();

    const { data: eventClass = [] } = useGetEventClass();
    const { data: eventTypes = [] } = useGetEventType();

    // ===== keep countryId updated when country changes (like create) =====
    useEffect(() => {
        if (watchCountry && countries.length > 0) {
            setValue(
                "countryId",
                countries?.find((item) => item.name === watchCountry)?.ID || ""
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchCountry, countries, setValue]);

    const handleBannerUrl = (index, url) => {
        const current = normalizeBannerArray(watch("banners"), 4);
        current[index] = url;
        setValue("banners", current, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    // ===== prefill base values from event =====
    useEffect(() => {
        if (!event) return;

        const initialBanners = normalizeBannerArray(
            [event.image1, event.image2, event.image3, event.image4].filter(
                Boolean
            ),
            4
        );

        reset({
            eventName: event.eventName || "",
            description: event.slogan || "",

            eventType: event.eventType || "",
            eventClass: event.eventClass || "",
            eventCategory: event.eventCategory || "",

            venue: event.venue || "",
            address: event.address || "",
            meetingLink: "",
            state: event.state || "",
            country: event.country || "",
            countryId: "",

            latitude: event.latitude || "",
            longitude: event.longitude || "",

            eventDate: event.eventDate || "",
            startTime: parseTimeToHHmm(event.startTime_2 || event.startTime),
            endTime: parseTimeToHHmm(event.endTime_2 || event.endTime),

            perpetual: toBool(event.perpetual),
            virtual: toBool(event.virtual),

            // ✅ IMPORTANT: set banners here
            banners: initialBanners,

            website: event.website || "",
            igHandle: event.igHandle || "",
            twitterHandle: event.twitterHandle || "",
            facebookHandle: event.facebookHandle || "",
            snapchat: event.snapchat || "",
            tiktok: event.tiktok || "",
        });
    }, [event, reset]);

    // ===== after lists load, convert existing values to codes (important) =====
    useEffect(() => {
        if (!event) return;

        // Event Class
        if (eventClass.length) {
            const cls = resolveCode(eventClass, event.eventClass);
            if (cls) setValue("eventClass", cls);
        }

        // Event Type
        if (eventTypes.length) {
            const type = resolveCode(eventTypes, event.eventType);
            if (type) setValue("eventType", type);
        }

        // Category
        if (eventCategories.length) {
            const cat = resolveCode(eventCategories, event.eventCategory);
            if (cat) setValue("eventCategory", cat);
        }
    }, [event, eventClass, eventTypes, eventCategories, setValue]);

    // ===== clear conditional errors (same concept) =====
    useEffect(() => {
        if (watchVirtual) {
            clearErrors("address");
        } else {
            clearErrors("meetingLink");
        }
    }, [watchVirtual, clearErrors]);

    const onSubmit = async (data) => {
        const payload = {
            eventId: event?.eventId,
            id: event?.id,

            venue: data.venue,
            state: data.state,
            country: data.country,
            perpetual: data.perpetual ? 1 : 0,
            virtual: data.virtual ? 1 : 0,

            eventClass: data.eventClass,
            address: data.virtual ? data.meetingLink : data.address,

            // if perpetual, your backend might expect day-of-week format.
            // You used a special endpoint for days in create. Here we keep it as-is.
            eventDate: data.eventDate,

            startTime: hhmmTo12h(data.startTime),
            endTime: hhmmTo12h(data.endTime),

            eventCategory: data.eventCategory,
            eventType: data.eventType,
            eventName: data.eventName,
            slogan: data.description,

            longitude: data.longitude,
            latitude: data.latitude,

            files: data.banners,

            website: data.website,
            igHandle: data.igHandle,
            twitterHandle: data.twitterHandle,
            facebookHandle: data.facebookHandle,
            snapchat: data.snapchat,
            tiktok: data.tiktok,
            ID: event.id,
        };

        try {
            const res = await editEvent(payload);
            // alert(res?.message || "Event updated successfully");
            // handleClose?.();

            // console.log("EDIT EVENT PAYLOAD:", payload);
            alert(res.message);
            navigate("/my-events");
        } catch (e) {
            alert(
                e?.response?.data?.message || e?.message || "An error occurred"
            );
        }
    };

    if (!event) {
        return (
            <div className="p-4 bg-white rounded-2xl border border-gray-200">
                <p className="text-sm text-gray-700 font-semibold">
                    No event supplied.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    Navigate here using:
                    <span className="ml-1 font-mono">
                        navigate(&quot;/edit-event&quot;,{" "}
                        {"{ state: { event } }"})
                    </span>
                </p>

                <div className="mt-4 flex gap-2">
                    <BaseButton onClick={() => navigate(-1)} variant="outlined">
                        Go Back
                    </BaseButton>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* ================= EVENT NAME ================= */}
            <div className="space-y-4">
                <Controller
                    name="eventName"
                    control={control}
                    rules={{ required: "Event Name is required" }}
                    render={({ field }) => (
                        <BaseInput
                            label="Event Name"
                            {...field}
                            error={errors.eventName}
                            errorText={errors.eventName?.message}
                        />
                    )}
                />

                <Controller
                    name="description"
                    control={control}
                    rules={{
                        required: "Event Description is required",
                        minLength: {
                            value: 5,
                            message: "Minimum 5 characters",
                        },
                    }}
                    render={({ field }) => (
                        // If you have BaseTextArea, swap this to BaseTextArea like create.
                        <BaseInput
                            label="Event Description"
                            {...field}
                            error={errors.description}
                            errorText={errors.description?.message}
                        />
                    )}
                />
            </div>

            {/* ================= EVENT CATEGORY DETAILS (create-style) ================= */}
            <div className="space-y-4">
                <Controller
                    name="eventClass"
                    control={control}
                    rules={{ required: "Event class is required" }}
                    render={({ field }) => (
                        <BaseSelect
                            label="Event Class"
                            {...field}
                            error={errors.eventClass}
                            errorText={errors.eventClass?.message}
                        >
                            <option></option>
                            {eventClass.map((item) => (
                                <option key={item.code} value={item.code}>
                                    {item.name_}
                                </option>
                            ))}
                        </BaseSelect>
                    )}
                />

                <Controller
                    name="eventType"
                    control={control}
                    rules={{ required: "Event type is required" }}
                    render={({ field }) => (
                        <BaseSelect
                            label="Event Type"
                            {...field}
                            error={errors.eventType}
                            errorText={errors.eventType?.message}
                        >
                            <option></option>
                            {eventTypes.map((item) => (
                                <option key={item.code} value={item.code}>
                                    {item.name}
                                </option>
                            ))}
                        </BaseSelect>
                    )}
                />

                <CustomSelect
                    label="Event Category"
                    name="eventCategory"
                    id="eventCategory"
                    control={control}
                    options={
                        eventCategories?.map((item) => ({
                            value: item.code,
                            label: item.name,
                        })) ?? []
                    }
                    error={!!errors.eventCategory}
                    errorText={errors.eventCategory?.message}
                    rules={{ required: "Event category is required" }}
                    isLoading={gettingEventCategory}
                />
            </div>

            {/* ================= LOCATION (create-style) ================= */}
            <div className="space-y-4">
                {/* Virtual checkbox */}
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
                                onChange={(e) =>
                                    field.onChange(e.target.checked)
                                }
                            />
                            <label htmlFor="virtual">Virtual</label>
                        </div>
                    )}
                />

                {watchVirtual === true && (
                    <Controller
                        name="meetingLink"
                        control={control}
                        rules={{
                            required: "Meeting link is required",
                            validate: (v) =>
                                isValidUrl(v) || "Please enter a valid URL",
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
            </div>

            {/* ================= DATE & TIME ================= */}
            <div className="space-y-4">
                {/* Perpetual checkbox (kept same field; if you want day-of-week picker, we can plug it in) */}
                <Controller
                    name="perpetual"
                    control={control}
                    render={({ field }) => (
                        <div className="flex text-sm gap-2 items-center">
                            <input
                                type="checkbox"
                                id="perpetual"
                                className="accent-primary h-4 w-4"
                                checked={field.value}
                                onChange={(e) =>
                                    field.onChange(e.target.checked)
                                }
                            />
                            <label htmlFor="perpetual">Perpetual</label>
                        </div>
                    )}
                />

                {/* If perpetual is true, your create flow uses a "days" dropdown.
                    Here we keep it as a date input unless you want the day dropdown plugged in. */}
                <Controller
                    name="eventDate"
                    control={control}
                    rules={{ required: "Event Date is required" }}
                    render={({ field }) => (
                        <BaseInput
                            label={watchPerpetual ? "Event Day" : "Event Date"}
                            type={watchPerpetual ? "text" : "date"}
                            {...field}
                            error={errors.eventDate}
                            errorText={errors.eventDate?.message}
                        />
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                        name="startTime"
                        control={control}
                        rules={{ required: "Start Time is required" }}
                        render={({ field }) => (
                            <BaseInput
                                label="Start Time"
                                type="time"
                                {...field}
                                error={errors.startTime}
                                errorText={errors.startTime?.message}
                            />
                        )}
                    />

                    <Controller
                        name="endTime"
                        control={control}
                        rules={{
                            required: "End Time is required",
                            validate: (val) => {
                                if (!startTimeVal || !val) return true;
                                if (val <= startTimeVal)
                                    return "End time must be after start time";
                                return true;
                            },
                        }}
                        render={({ field }) => (
                            <BaseInput
                                label="End Time"
                                type="time"
                                {...field}
                                error={errors.endTime}
                                errorText={errors.endTime?.message}
                            />
                        )}
                    />
                </div>
            </div>

            {/* ================= OPTIONAL MEDIA (edit optional) ================= */}
            {/* <Controller
                name="banners"
                control={control}
                rules={{
                    validate: (files) => {
                        if (!files || files.length === 0) return true;
                        const okTypes = [
                            "image/png",
                            "image/jpeg",
                            "image/jpg",
                            "image/webp",
                        ];
                        for (const f of files) {
                            if (!okTypes.includes(f.type))
                                return "Only images (png/jpg/webp) allowed";
                            if (f.size > 1 * 1024 * 1024)
                                return "Each image must be <= 1MB";
                        }
                        return true;
                    },
                }}
                render={({ field }) => (
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Banners (optional)
                        </label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) =>
                                field.onChange(Array.from(e.target.files || []))
                            }
                            className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-3 text-sm"
                        />
                        {errors.banners?.message && (
                            <p className="text-xs text-red-600 mt-2">
                                {errors.banners.message}
                            </p>
                        )}

                        <p className="text-[11px] text-gray-500 mt-2">
                            Current banner:{" "}
                            {event?.image1 ? "Already set" : "None"}
                        </p>
                    </div>
                )}
            /> */}

            <div className="space-y-3">
                <div>
                    <p className="text-sm font-semibold text-gray-700">
                        Event Banners (optional)
                    </p>
                    <p className="text-xs text-gray-500">
                        Upload up to 4 banners. Each upload returns a Cloudinary
                        URL and will be submitted as <b>files</b>.
                    </p>
                </div>

                <Controller
                    name="banners"
                    control={control}
                    rules={{
                        validate: (urls) => {
                            if (!urls || urls.every((x) => !x)) return true;

                            for (const u of urls) {
                                if (!u) continue;
                                if (typeof u !== "string")
                                    return "Invalid banner URL";
                                if (!isValidUrl(u))
                                    return "One of the banner URLs is invalid";
                            }
                            return true;
                        },
                    }}
                    render={() => (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {normalizeBannerArray(watchBanners, 4).map(
                                    (url, idx) => (
                                        <BannerCard
                                            key={idx}
                                            index={idx}
                                            initialUrl={url}
                                            onImageUpload={handleBannerUrl}
                                        />
                                    )
                                )}
                            </div>

                            {errors.banners?.message ? (
                                <p className="text-xs text-red-600">
                                    {errors.banners.message}
                                </p>
                            ) : null}
                        </>
                    )}
                />
            </div>

            {/* ================= OPTIONAL SOCIALS ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                    name="website"
                    control={control}
                    rules={{
                        validate: (v) =>
                            isValidUrl(v) || "Enter a valid URL (https://...)",
                    }}
                    render={({ field }) => (
                        <BaseInput
                            label="Website (optional)"
                            placeholder="https://..."
                            {...field}
                            error={errors.website}
                            errorText={errors.website?.message}
                        />
                    )}
                />

                <Controller
                    name="igHandle"
                    control={control}
                    render={({ field }) => (
                        <BaseInput
                            label="Instagram (optional)"
                            placeholder="@handle"
                            {...field}
                        />
                    )}
                />

                <Controller
                    name="twitterHandle"
                    control={control}
                    render={({ field }) => (
                        <BaseInput
                            label="Twitter (optional)"
                            placeholder="@handle"
                            {...field}
                        />
                    )}
                />

                <Controller
                    name="facebookHandle"
                    control={control}
                    render={({ field }) => (
                        <BaseInput
                            label="Facebook (optional)"
                            placeholder="page/profile"
                            {...field}
                        />
                    )}
                />

                <Controller
                    name="tiktok"
                    control={control}
                    render={({ field }) => (
                        <BaseInput
                            label="TikTok (optional)"
                            placeholder="@handle"
                            {...field}
                        />
                    )}
                />

                <Controller
                    name="snapchat"
                    control={control}
                    render={({ field }) => (
                        <BaseInput
                            label="Snapchat (optional)"
                            placeholder="@handle"
                            {...field}
                        />
                    )}
                />
            </div>

            {/* ================= ACTIONS ================= */}
            <div className="pt-2 flex gap-3">
                <BaseButton
                    type="submit"
                    loading={isSubmitting || isPending}
                    className="!rounded-xl"
                >
                    Save Changes
                </BaseButton>

                <BaseButton
                    type="button"
                    variant="outlined"
                    onClick={() => navigate(-1)}
                    className="!rounded-xl"
                >
                    Cancel
                </BaseButton>
            </div>
        </form>
    );
};

export default EditEventForm;
