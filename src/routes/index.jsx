import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import { Layout } from "../components/Layout";

import EventsCategoryPage from "../pages/Events/EventsCategoryPage";
import EventDescription from "../pages/Events/EventDescription";
import CreateEventPage from "../pages/CreateEvent";
import PostedEvents from "../pages/PostedEvents";
import EventDetails from "../pages/PostedEvents/EventDetails";
import EditEvent from "../pages/EditEvent";

import PrivateRoutes from "./PrivateRoutes";
import EventInformation from "../pages/Events/EventInformation";
import MyEventsPage from "../pages/MyEvents";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Layout>
                <Outlet />
            </Layout>
        ),
        children: [
            // PUBLIC: /dashboard/**
            {
                path: "dashboard",
                element: <Outlet />,
                children: [
                    { index: true, element: <EventsCategoryPage /> },
                    { path: "details", element: <EventDescription /> },
                    { path: ":id/:class", element: <EventInformation /> },
                ],
            },

            // PROTECTED: everything else
            {
                element: <PrivateRoutes />,
                children: [
                    { path: "create-event", element: <CreateEventPage /> },
                    { path: "posted-events", element: <PostedEvents /> },
                    { path: "my-events", element: <MyEventsPage /> },
                    { path: "edit-event", element: <EditEvent /> },
                    { path: "events-details", element: <EventDetails /> },
                ],
            },
        ],
    },
]);

const BaseRoutes = () => <RouterProvider router={router} />;
export default BaseRoutes;
