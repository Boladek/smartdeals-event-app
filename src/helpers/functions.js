import storage from "./storage";
// import * as XLSX from "xlsx";

export function formatNumber(num, decimal = 0) {
    return Intl.NumberFormat("en-US", {
        style: "decimal",
        maximumFractionDigits: decimal,
        minimumFractionDigits: decimal,
    }).format(Number(num));
}

export function formatDateDay(date) {
    if (!date) return "N/A";
    const newDate = new Date(date);
    const formatter = new Intl.DateTimeFormat("en-US", {
        weekday: "short", // Mon, Tue, etc.
    });
    return formatter.format(newDate);
}

export function formatDate(date) {
    if (!date) return "N/A";
    const newDate = new Date(date);
    const formatter = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const parts = formatter.formatToParts(newDate);
    const monthPart = parts.find((part) => part.type === "month");
    const dayPart = parts.find((part) => part.type === "day");
    const yearPart = parts.find((part) => part.type === "year");

    const month = monthPart ? monthPart.value.toUpperCase() : "N/A";
    const day = dayPart ? dayPart.value : "N/A";
    let year = yearPart ? yearPart.value : "N/A";

    const formatDay = day.length === 1 ? `0${day}` : day;

    // Check if the year is less than or equal to 2000,
    // and adjust e.g. 50 => 2050, 99 => 1999
    if (parseInt(year, 10) <= 2000) {
        if (parseInt(year, 10) <= 50) {
            year = `20${year.substring(2)}`; // Adjust year to 20xx
        } else {
            year = `19${year.substring(2)}`; // Adjust to 19xx if needed
        }
    }

    return `${formatDay}-${month}-${year}`;
}

export function getFormattedDateTime() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(now.getDate()).padStart(2, "0");

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const isAuth = () => storage.getUser() && storage.getToken();

export const renderStatusTag = (status) => {
    if (!status) return "bg-gray-100 text-gray-600";

    const normalized = status.toLowerCase();

    const statusMap = {
        completed: "bg-green-100 text-green-800",
        pending: "bg-yellow-100 text-yellow-800",
        processing: "bg-blue-100 text-blue-800",
        "ready for payment": "bg-teal-100 text-teal-800",
        "ready for pickup": "bg-indigo-100 text-indigo-800",
        "update required": "bg-orange-100 text-orange-800",
    };

    return statusMap[normalized] || "bg-gray-100 text-gray-600";
};

export const getGeolocation = (onSuccess, onError) => {
    if (navigator.geolocation) {
        // Request the current position
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // If the location is successfully retrieved, call the onSuccess callback
                onSuccess(position.coords);
                localStorage.setItem("permission", "granted");
            },
            (error) => {
                let errorMessage;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage =
                            "User denied the request for geolocation.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        errorMessage =
                            "The request to get user location timed out.";
                        break;
                    case error.UNKNOWN_ERROR:
                        errorMessage = "An unknown error occurred.";
                        break;
                    default:
                        errorMessage = "Position update is unavailable";
                }

                // Call the onError callback with the appropriate error message
                onError(errorMessage);
            }
        );
    } else {
        // If the browser doesn't support geolocation, call onError
        onError("Geolocation is not supported by this browser.");
    }
};

export function formatEventDate(dateString) {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-NG", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export function formatEventTime(startTime, endTime) {
    if (!startTime && !endTime) return "Time to be announced";
    const format = (t) => {
        const d = new Date(`1970-01-01T${t}`);
        if (Number.isNaN(d.getTime())) return t;
        return d.toLocaleTimeString("en-NG", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (startTime && endTime)
        return `${format(startTime)} - ${format(endTime)}`;
    if (startTime) return format(startTime);
    if (endTime) return format(endTime);
    return "Time to be announced";
}

export function getOrganizerInitials(event) {
    const source = event?.partnerName || event?.username || "";
    if (!source) return "EV";
    const parts = source.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

export function generateEventId(prefix = "Event") {
    const randomPart = Math.random().toString(36).substring(2, 10); // e.g. 87123gsd

    const timestampPart = Date.now().toString().slice(-9); // e.g. 162883628

    return `${prefix}-${randomPart}-${timestampPart}`;
}
