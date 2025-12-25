import React, { useEffect, useMemo, useState } from "react";
import { SideDrawer } from "./SideDrawer";
import { BaseButton } from "./BaseButton";
import { BaseInput } from "./BaseInput";
import { BaseSelect } from "./BaseSelect";
import useEnableLocation from "../hooks/EnableLocationHook";
import {
    useGetCountries,
    useGetEventByCategory,
    useGetEventType,
    useGetStates,
} from "../hooks/EventsHooks";
import Select from "react-select";

const EVENT_ACTIONS = [
    { value: "eventcategory", description: "Filter events by category" },
    {
        value: "eventtype",
        description: "Filter events by event type (Paid or Free)",
    },
    { value: "search", description: "Search events by keyword" },
    { value: "date", description: "Filter events by date" },
    { value: "time", description: "Filter events by time" },
    { value: "location", description: "Filter events by country and state" },
    {
        value: "nearby",
        description: "Find events close to your current location",
    },
    { value: "amount", description: "Filter events by ticket price range" },
];

const ACTION_FIELDS = {
    eventcategory: [
        {
            name: "eventCategory",
            label: "Event Category",
            type: "selectCategory",
        },
    ],
    eventtype: [
        {
            name: "eventType",
            label: "Event Type",
            type: "select",
            source: "eventTypes",
        },
    ],
    search: [
        {
            name: "keyword",
            label: "Keyword",
            type: "text",
            placeholder: "Search keywords...",
        },
    ],
    date: [{ name: "startDate", label: "Start Date", type: "date" }],
    time: [
        { name: "startTime", label: "Start Time", type: "time" },
        { name: "endTime", label: "End Time", type: "time" },
    ],
    location: [
        { name: "country", label: "Country", type: "selectCountry" },
        { name: "state", label: "State", type: "selectState" },
    ],
    nearby: [],
    amount: [
        {
            name: "minAmount",
            label: "Min Amount",
            type: "number",
            placeholder: "0",
        },
        {
            name: "maxAmount",
            label: "Max Amount",
            type: "number",
            placeholder: "10000",
        },
    ],
};

export function EventActions({ handleAction, handleClose, clearAction }) {
    const [action, setAction] = useState("");
    const [values, setValues] = useState({});
    const [errors, setErrors] = useState({});

    const [selectedCountry, setSelectedCountry] = useState(null); // { label, value(ID), raw }
    const [selectedState, setSelectedState] = useState(null); // { label, value, raw }

    const { data: countries = [], isLoading: gettingCountries } =
        useGetCountries();
    const { data: states = [], isLoading: gettingStates } = useGetStates({
        countryID: selectedCountry?.value,
    });

    const { data: eventCategories = [], isLoading: loadingCategories } =
        useGetEventByCategory();
    const { data: eventTypes = [], isLoading: loadingTypes } =
        useGetEventType();

    const { location, permission, error, handleAllow, handleDeny } =
        useEnableLocation();

    const fields = useMemo(() => ACTION_FIELDS[action] || [], [action]);
    const isNearby = action === "nearby";
    const isLocation = action === "location";

    // reset when action changes
    useEffect(() => {
        setValues({});
        setErrors({});
        setSelectedCountry(null);
        setSelectedState(null);
    }, [action]);

    // nearby auto-fill coords
    useEffect(() => {
        if (!isNearby) return;
        if (location?.latitude && location?.longitude) {
            setValues((prev) => ({
                ...prev,
                latitude: String(location.latitude),
                longitude: String(location.longitude),
            }));
            setErrors((prev) => ({ ...prev, nearby: "" }));
        }
    }, [isNearby, location?.latitude, location?.longitude]);

    // when country changes, clear state
    useEffect(() => {
        if (!isLocation) return;
        setSelectedState(null);
        setValues((prev) => ({ ...prev, state: "" }));
    }, [selectedCountry?.value]);

    const setFieldValue = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const nextErrors = {};
        if (!action) nextErrors.action = "Please select a filter action.";

        // normal fields
        for (const f of fields) {
            const v = values[f.name];
            const isEmpty =
                v === undefined ||
                v === null ||
                (typeof v === "string" && v.trim() === "");
            if (isEmpty) nextErrors[f.name] = `${f.label} is required`;
        }

        // nearby validation
        if (isNearby) {
            if (!values.latitude || !values.longitude) {
                nextErrors.nearby = "Please enable location to use Nearby.";
            }
            if (permission === "denied") {
                nextErrors.nearby =
                    "Location permission is denied. Enable it in your browser settings.";
            }
        }

        // amount sanity
        if (action === "amount") {
            const min = Number(values.minAmount);
            const max = Number(values.maxAmount);
            if (!Number.isNaN(min) && !Number.isNaN(max) && min > max) {
                nextErrors.maxAmount =
                    "Max Amount must be greater than Min Amount";
            }
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const onApply = () => {
        if (!validate()) return;

        const payload = { action };

        // add normal fields
        fields.forEach((f) => {
            payload[f.name] = values[f.name];
        });

        // nearby coords
        if (isNearby) {
            payload.latitude = values.latitude;
            payload.longitude = values.longitude;
        }

        // (optional) if your backend wants one "location" string too:
        if (isLocation) {
            payload.location = [values.state, values.country]
                .filter(Boolean)
                .join(", ");
        }

        handleAction(payload);
        handleClose?.();
    };

    const onClear = () => {
        setAction("");
        setValues({});
        setErrors({});
        setSelectedCountry(null);
        setSelectedState(null);
    };

    const canApplyNearby =
        permission === "granted" && values.latitude && values.longitude;

    // build react-select options
    const countryOptions = useMemo(
        () =>
            countries.map((c) => ({
                label: c.name,
                value: c.ID,
                raw: c,
            })),
        [countries]
    );

    const stateOptions = useMemo(
        () =>
            states.map((s) => ({
                label: s.name,
                value: s.ID ?? s.name,
                raw: s,
            })),
        [states]
    );

    return (
        <SideDrawer
            title="Select Filter"
            handleClose={() => {
                clearAction?.();
                handleClose?.();
            }}
        >
            <div className="space-y-4">
                {/* Action selector */}
                <div className="space-y-1">
                    <BaseSelect
                        label="Filter Type"
                        value={action}
                        onChange={(e) => setAction(e.target.value)}
                        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${
                            errors.action ? "border-red-500" : "border-gray-200"
                        }`}
                    >
                        <option value="">Select an action</option>
                        {EVENT_ACTIONS.map((a) => (
                            <option key={a.value} value={a.value}>
                                {a.description}
                            </option>
                        ))}
                    </BaseSelect>

                    {errors.action && (
                        <p className="text-xs text-red-600">{errors.action}</p>
                    )}
                </div>

                {/* Nearby UI (unchanged) */}
                {isNearby && (
                    <div className="rounded-xl border border-gray-200 p-4 bg-gray-50 space-y-2">
                        <p className="text-sm font-semibold text-gray-800">
                            Use your current location
                        </p>

                        {permission === "prompt" && (
                            <>
                                <p className="text-xs text-gray-600">
                                    Allow location access to find events near
                                    you.
                                </p>
                                <div className="flex gap-2">
                                    <BaseButton
                                        type="button"
                                        className="w-full"
                                        onClick={handleAllow}
                                    >
                                        Enable Location
                                    </BaseButton>
                                    <BaseButton
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={handleDeny}
                                    >
                                        Not now
                                    </BaseButton>
                                </div>
                            </>
                        )}

                        {permission === "denied" && (
                            <p className="text-xs text-red-600">
                                Location permission denied. Please enable it in
                                your browser settings.
                            </p>
                        )}

                        {permission === "granted" && (
                            <div className="grid grid-cols-2 gap-2">
                                <BaseInput
                                    label="Latitude"
                                    type="text"
                                    value={values.latitude || ""}
                                    readOnly
                                />
                                <BaseInput
                                    label="Longitude"
                                    type="text"
                                    value={values.longitude || ""}
                                    readOnly
                                />
                            </div>
                        )}

                        {(errors.nearby || error) && (
                            <p className="text-xs text-red-600">
                                {errors.nearby || error}
                            </p>
                        )}
                    </div>
                )}

                {/* Conditional fields */}
                {action && !isNearby && (
                    <div className="space-y-3">
                        {fields.map((f) => {
                            // event category
                            if (f.type === "selectCategory") {
                                return (
                                    <div key={f.name} className="space-y-1">
                                        <BaseSelect
                                            label={f.label}
                                            value={values[f.name] ?? ""}
                                            onChange={(e) =>
                                                setFieldValue(
                                                    f.name,
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${
                                                errors[f.name]
                                                    ? "border-red-500"
                                                    : "border-gray-200"
                                            }`}
                                            disabled={loadingCategories}
                                        >
                                            <option value="">
                                                {loadingCategories
                                                    ? "Loading categories..."
                                                    : "Select category"}
                                            </option>
                                            {eventCategories.map((cat) => (
                                                <option
                                                    key={cat.id}
                                                    value={cat.name}
                                                >
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </BaseSelect>
                                        {errors[f.name] && (
                                            <p className="text-xs text-red-600">
                                                {errors[f.name]}
                                            </p>
                                        )}
                                    </div>
                                );
                            }

                            // event type (from API)
                            if (
                                f.type === "select" &&
                                f.source === "eventTypes"
                            ) {
                                return (
                                    <div key={f.name} className="space-y-1">
                                        <BaseSelect
                                            label={f.label}
                                            value={values[f.name] ?? ""}
                                            onChange={(e) =>
                                                setFieldValue(
                                                    f.name,
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${
                                                errors[f.name]
                                                    ? "border-red-500"
                                                    : "border-gray-200"
                                            }`}
                                            disabled={loadingTypes}
                                        >
                                            <option value="">
                                                {loadingTypes
                                                    ? "Loading types..."
                                                    : "Select type"}
                                            </option>
                                            {eventTypes.map((opt) => (
                                                <option
                                                    key={opt.id ?? opt.code}
                                                    value={opt.code}
                                                >
                                                    {opt.name}
                                                </option>
                                            ))}
                                        </BaseSelect>
                                        {errors[f.name] && (
                                            <p className="text-xs text-red-600">
                                                {errors[f.name]}
                                            </p>
                                        )}
                                    </div>
                                );
                            }

                            // ✅ country/state selects
                            if (f.type === "selectCountry") {
                                return (
                                    <div key={f.name} className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-700">
                                            Country
                                        </label>
                                        <Select
                                            isLoading={gettingCountries}
                                            options={countryOptions}
                                            value={selectedCountry}
                                            onChange={(opt) => {
                                                setSelectedCountry(opt);
                                                setFieldValue(
                                                    "country",
                                                    opt?.label || ""
                                                );
                                                setFieldValue(
                                                    "countryID",
                                                    opt?.value || ""
                                                );
                                            }}
                                            placeholder={
                                                gettingCountries
                                                    ? "Loading countries..."
                                                    : "Select country"
                                            }
                                        />
                                        {errors.country && (
                                            <p className="text-xs text-red-600">
                                                {errors.country}
                                            </p>
                                        )}
                                    </div>
                                );
                            }

                            if (f.type === "selectState") {
                                return (
                                    <div key={f.name} className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-700">
                                            State
                                        </label>
                                        <Select
                                            isLoading={gettingStates}
                                            options={stateOptions}
                                            value={selectedState}
                                            onChange={(opt) => {
                                                setSelectedState(opt);
                                                setFieldValue(
                                                    "state",
                                                    opt?.label || ""
                                                );
                                            }}
                                            isDisabled={!selectedCountry}
                                            placeholder={
                                                !selectedCountry
                                                    ? "Select country first"
                                                    : gettingStates
                                                    ? "Loading states..."
                                                    : "Select state"
                                            }
                                        />
                                        {errors.state && (
                                            <p className="text-xs text-red-600">
                                                {errors.state}
                                            </p>
                                        )}
                                    </div>
                                );
                            }

                            // fallback: inputs
                            return (
                                <div key={f.name} className="space-y-1">
                                    <BaseInput
                                        label={f.label}
                                        type={f.type}
                                        placeholder={f.placeholder}
                                        value={values[f.name] ?? ""}
                                        onChange={(e) =>
                                            setFieldValue(
                                                f.name,
                                                e.target.value
                                            )
                                        }
                                    />
                                    {errors[f.name] && (
                                        <p className="text-xs text-red-600">
                                            {errors[f.name]}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                    <BaseButton
                        variant="outline"
                        onClick={onClear}
                        className="w-full"
                        type="button"
                    >
                        Clear
                    </BaseButton>

                    <BaseButton
                        onClick={onApply}
                        className="w-full"
                        type="button"
                        disabled={isNearby ? !canApplyNearby : false}
                    >
                        Apply Filter
                    </BaseButton>
                </div>
            </div>
        </SideDrawer>
    );
}
