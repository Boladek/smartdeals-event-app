import { useMutation, useQuery } from "@tanstack/react-query";
import { eventApi } from "../requests/event-requests";
import customAxios from "../helpers/customAxios";
import { paymentEncryption } from "../helpers/encryption";
import CryptoJS from "crypto-js";
import { getFormattedDateTime } from "../helpers/functions";
import paymentAxios from "../helpers/paymentAxios";
import { configKeys } from "../helpers/config";

export const useEvent = (eventId) => {
    return useQuery({
        queryKey: ["event", eventId],
        queryFn: () => eventApi.fetchEventById(eventId),
        enabled: !!eventId,
    });
};

export const useGetAllEvents = ({ page = 0, direction = "asc" }) => {
    return useQuery({
        queryKey: ["all-event", page, direction], // Query key is an array
        queryFn: () => eventApi.getUserAllEvents({ page, direction }), // The function to fetch data
        staleTime: Infinity,
        retry: 2,
        select: (data) => {
            // Adjust the response data structure as needed
            return {
                data: data.data, // list of events
                hasNextPage: data.hasNextPage, // Pagination info
                hasPreviousPage: data.hasPreviousPage,
                pageBack: data.page_back,
                pageForward: data.page_forward,
            };
        },
    });
};

export const useGetEventByCategory = () => {
    return useQuery({
        queryKey: ["event-catergory"],
        queryFn: () => eventApi.getEventCategory(),
        staleTime: Infinity,
        select: (data) => data.data,
        retry: 2,
    });
};

export const useGetEventClass = () => {
    return useQuery({
        queryKey: ["event-class"],
        queryFn: () => eventApi.getEventClass(),
        staleTime: Infinity,
        select: (data) => data.data,
        retry: 2,
    });
};

export const useGetEventTickets = (param) => {
    return useQuery({
        queryKey: ["event-tickets" + param.eventId, param.eventId],
        queryFn: () => eventApi.getEventTickets(param),
        staleTime: Infinity,
        select: (data) => data.data,
        retry: 2,
        enabled: !!param.eventId,
    });
};

export const useGetEventTicket = (param) => {
    return useQuery({
        queryKey: ["event-ticket" + param.eventId, param.eventId],
        queryFn: () => eventApi.getEventTicket(param),
        staleTime: Infinity,
        select: (data) => data.data,
        retry: 2,
        enabled: !!param.eventId,
    });
};

export const useLogin = () => {
    return useMutation({
        mutationFn: (body) => eventApi.login(body),
    });
};

export const useGetSigmaKey = () => {
    return useMutation({
        mutationFn: (params) => customAxios.get("/customer/fpk", { params }),
    });
};

export const useCreateEvent = () => {
    return useMutation({
        mutationFn: (body) => eventApi.createEvent(body),
    });
};

export function useGetCountries() {
    return useQuery({
        queryKey: ["fetch-countries"],
        queryFn: () => customAxios.get("getAllCountry"),
        staleTime: Infinity,
        retry: 1,
    });
}

export function useGetStates(params) {
    return useQuery({
        queryKey: ["fetch-states", params.countryID],
        queryFn: () =>
            customAxios.get("/getState", {
                params,
            }),
        staleTime: Infinity,
        retry: 1,
        enabled: !!params.countryID,
    });
}

export const useGetEventType = (param) => {
    return useQuery({
        queryKey: ["event-type"],
        queryFn: () => eventApi.getEventType(),
        staleTime: Infinity,
        select: (data) => data.data,
        retry: 2,
        // enabled: !!param.eventId,
    });
};

export const useGetEventDays = () => {
    return useQuery({
        queryKey: ["event-days"],
        queryFn: () => customAxios.get("/customer/fetchDays"),
        staleTime: Infinity,
        select: (data) => data.data,
        retry: 2,
        // enabled: !!param.eventId,
    });
};

export const useUploadImage = () => {
    return useMutation({
        mutationFn: (body) =>
            customAxios.post("/customer/uploadImageToCloudinary", body, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }),
    });
};

export const usePayment = () => {
    return useMutation({
        mutationFn: (body) =>
            customAxios.post("/customer/uploadImageToCloudinary", body, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }),
    });
};

export const useBuyTicketGuest = () => {
    return useMutation({
        mutationFn: (body) => eventApi.buyTicketGuest(body),
    });
};

export const useBuyTicket = () => {
    return useMutation({
        mutationFn: (body) => eventApi.buyTicket(body),
    });
};

export const useVerifyPayWithWallet = () => {
    return useMutation({
        mutationFn: (body) =>
            customAxios.post("/verifyPayWithSmartDeals", body),
    });
};

export const usePayWithSmartDeals = () => {
    const secret = configKeys.paymentSecret;
    const agency = configKeys.agencyKey;

    const input = `${agency}:${secret}`; // Step 2: Combine
    const signature = CryptoJS.SHA512(input).toString();

    const apiBody = {
        secret,
        agency,
        signature,
        time: getFormattedDateTime(),
    };

    return useMutation({
        mutationFn: (body) =>
            paymentAxios.post("payWithSmartDeals", body, {
                headers: {
                    sigma: paymentEncryption(apiBody),
                    zelda: signature,
                },
            }),
    });
};

export const useVerifyPayWithSmartDeals = () => {
    const secret = configKeys.paymentSecret;
    const agency = configKeys.agencyKey;

    const input = `${agency}:${secret}`; // Step 2: Combine
    const signature = CryptoJS.SHA512(input).toString();

    const apiBody = {
        secret,
        agency,
        signature,
        time: getFormattedDateTime(),
    };

    return useMutation({
        mutationFn: ({ transactionId, amount }) =>
            paymentAxios.get("verifyPayWithSmartDeals", {
                headers: {
                    sigma: paymentEncryption(apiBody),
                    zelda: signature,
                },
                params: {
                    transactionId,
                    amount,
                },
            }),
    });
};

export const useEventPaymentDetails = () => {
    return useMutation({
        mutationFn: (body) =>
            customAxios.post(
                "/event/getEventPaymentTransactionDetails",
                body
            ),
    });
};

export const useEventPaymentDetailsGuest = () => {
    return useMutation({
        mutationFn: (body) =>
            customAxios.post(
                "/event/getEventPaymentTransactionDetails_guest",
                body
            ),
    });
};

export const useGetEventPaymentDetails = (params) => {
    return useQuery({
        queryKey: ["payment-details"],
        queryFn: () =>
            customAxios.post(
                "/event/getEventPaymentTransactionDetails_guest",
                params
            ),
        staleTime: Infinity,
        select: (data) => data.data,
        retry: 2,
        // enabled: !!param.eventId,
    });
};
