import customAxios from "../helpers/customAxios";
// import storage from "../helpers/storage";

export const eventApi = {
    // Manager logo
    storeEventManagerLogo(formData) {
        return customAxios.post("/storeEventManagerLogo", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    fetchEventManagerLogo(params) {
        return customAxios.get("/event/fetchEventManagerLogo", { params });
    },

    // Event metadata
    getEventCategory(params) {
        return customAxios.get("/event/getEventCategory", { params });
    },

    getEventClass(params) {
        return customAxios.get("/customer/getEventClass", { params });
    },

    getEventType() {
        return customAxios.get("/event/getEventType");
    },

    getEventZone(params) {
        return customAxios.get("/getEventZone", { params });
    },

    fetchEventManagerInfo(params) {
        return customAxios.get("/fetchEventManagerInfo", { params });
    },

    // Agents
    addAgent(payload) {
        return customAxios.post("/addAgent", payload);
    },

    editAgent(payload) {
        return customAxios.post("/editAgent", payload);
    },

    deleteAgent(payload) {
        return customAxios.post("/deleteAgent", payload);
    },

    getAgent(params) {
        return customAxios.get("/getAgent", { params });
    },

    // Tickets & purchase
    buyTicket(payload) {
        return customAxios.post("/event/buyTicket_web", payload);
    },

    buyTicketGuest(payload) {
        return customAxios.post("/event/buyTicket_guest", payload);
    },

    sendInvite(payload) {
        return customAxios.post("/sendInvite", payload);
    },

    // Events CRUD
    createEvent(payload) {
        return customAxios.post("/event/createEvent", payload);
    },

    editEvent(payload) {
        return customAxios.post("/event/editEvent", payload);
    },

    deleteEvent(payload) {
        return customAxios.post("/deleteEvent", payload);
    },

    // Event Tickets CRUD
    createEventTicket(payload) {
        return customAxios.post("/event/createEventTicket", payload);
    },

    editEventTicket(payload) {
        return customAxios.post("/event/editEventTicket", payload);
    },

    deleteEventTicket(payload) {
        return customAxios.post("/event/deleteEventTicket", payload);
    },

    // Check-in
    checkIn(payload) {
        return customAxios.post("/checkIn", payload);
    },

    // Payment transactions
    getEventPaymentTransactionDetails(payload) {
        return customAxios.post("/getEventPaymentTransactionDetails", payload);
    },

    getEventPaymentTransactionDetailsGuest(payload) {
        return customAxios.post(
            "/getEventPaymentTransactionDetails_guest",
            payload
        );
    },

    // Ticket Availability
    checkTicketAvailabilityGuest(params) {
        return customAxios.get("/checkTicketAvailability_guest", { params });
    },

    // Events list
    getEvent(params) {
        return customAxios.get("/event/getEvent", { params });
    },

    getAgentEvents(params) {
        return customAxios.get("/getAgentEvents", { params });
    },

    getAgentEventReport(params) {
        return customAxios.get("/getAgentEventReport", { params });
    },

    getUserEvent(params) {
        return customAxios.get("/event/getUserEvent", { params });
    },

    getAllEvents() {
        return customAxios.get("/event/getAllEvents");
    },

    getUserAllEvents(params) {
        return customAxios.get("/event/getUserAllEvents_web", { params });
    },

    getUserAllEventsFilter(params) {
        return customAxios.get("/event/filterEvents", { params });
    },

    // Attendees
    getAttendee(params) {
        return customAxios.get("/getAttendee", { params });
    },

    getAllAttendees(params) {
        return customAxios.get("/getAllAttendees", { params });
    },

    // Reports
    getEventReport(params) {
        return customAxios.get("/getEventReport", { params });
    },

    exportReport(params) {
        return customAxios.get("/exportReport", {
            params,
            responseType: "blob",
        });
    },

    // Event tickets (customer)
    getEventTickets(params) {
        return customAxios.get("/event/getEventTickets", { params });
    },

    getAllMyEvent(params) {
        return customAxios.get("/customer/getMyEvents", { params });
    },

    getEventTicket(params) {
        return customAxios.get("/event/getEventTicket", { params });
    },

    getUserEventTickets(params) {
        return customAxios.get("/getUserEventTickets", { params });
    },

    getUserEventTicketsGuest(params) {
        return customAxios.get("/getUserEventTickets_guest", { params });
    },

    getUserEventTicket(params) {
        return customAxios.get("/getUserEventTicket", { params });
    },

    getUserEventTicketGuest(params) {
        return customAxios.get("/getUserEventTicket_guest", { params });
    },

    login(body) {
        return customAxios.post("/login_web", body);
    },
};
