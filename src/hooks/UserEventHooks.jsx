import { useMutation, useQuery } from "@tanstack/react-query";
import { eventApi } from "../requests/event-requests";
import customAxios from "../helpers/customAxios";

// export const useEvent = (eventId) => {
//     return useQuery({
//         queryKey: ["event", eventId],
//         queryFn: () => eventApi.fetchEventById(eventId),
//         enabled: !!eventId,
//     });
// };

export const useGetEvent = (param) => {
    return useQuery({
        queryKey: ["event-details", param.eventId, param.eventClass],
        queryFn: () => eventApi.getUserEvent(param),
        enabled: !!param.eventId && !!param.eventClass,
    });
};

export const useGetMyEvents = ({ page = 0, direction = "asc" }) => {
    return useQuery({
        queryKey: ["my-events", page, direction], // Query key is an array
        queryFn: () => eventApi.getAllEvents(), // The function to fetch data
        staleTime: Infinity,
        retry: 2,
        select: (data) => {
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

export const useCreateEvent = () => {
    return useMutation({
        mutationFn: (body) => eventApi.createEvent(body),
    });
};

export const useEditEvent = () => {
    return useMutation({
        mutationFn: (body) => eventApi.editEvent(body),
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

export const useCreateTicket = () => {
    return useMutation({
        mutationFn: (body) => eventApi.createEventTicket(body),
    });
};

export const useEditTicket = () => {
    return useMutation({
        mutationFn: (body) => eventApi.editEventTicket(body),
    });
};

export const useDeleteTicket = () => {
    return useMutation({
        mutationFn: (body) => eventApi.deleteEventTicket(body),
    });
};

export const useGetEventPaymentDetails = (params) => {
    return useQuery({
        queryKey: ["event-details"],
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
