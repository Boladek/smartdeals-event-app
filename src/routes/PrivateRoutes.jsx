import React from "react";
import { UseAuth } from "../contexts/AuthContext";
import { Navigate, Outlet } from "react-router";

function PrivateRoutes() {
    const { isLoggedIn } = UseAuth();

    if (!isLoggedIn) return <Navigate to="/dashboard" replace />;

    return <Outlet />;
}

export default PrivateRoutes;
