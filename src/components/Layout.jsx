import { UseAuth } from "../contexts/AuthContext";
import { LoginForm } from "./LoginForm";
import { useLocation, useNavigate } from "react-router";
import {
    FaCalendarAlt, // All Events
    FaClipboardList, // My Events
    FaPlusCircle, // Create Event
    FaSignOutAlt,
} from "react-icons/fa";
import { useEffect } from "react";
import logo from "../assets/smartdeals.svg";

/**
 * 🔗 Central nav config (single source of truth)
 */
const NAV_LINKS = [
    {
        label: "All Events",
        shortLabel: "Events",
        path: "/dashboard",
        icon: FaCalendarAlt,
    },
    {
        label: "My Events",
        shortLabel: "My",
        path: "/my-events",
        icon: FaClipboardList,
    },
    {
        label: "Create Event",
        shortLabel: "Create",
        path: "/create-event",
        icon: FaPlusCircle,
    },
];
export const Layout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        openLoginModal,
        closeLoginModal,
        isLoggedIn,
        openLogin,
        user,
        logout,
    } = UseAuth();

    const isActive = (path) => location.pathname === path;

    const desktopLinkClass = (active) =>
        [
            "flex items-center gap-2 text-sm font-semibold transition-colors",
            active ? "text-primary" : "text-gray-700 hover:text-primary",
        ].join(" ");

    const mobileLinkClass = (active) =>
        [
            "flex flex-col items-center gap-1 text-xs font-semibold transition-colors",
            active ? "text-primary" : "text-gray-600 hover:text-primary",
        ].join(" ");

    useEffect(() => {
        if (location.pathname === "/") {
            navigate("/dashboard");
        }
    }, [location]);

    return (
        <div className="h-screen flex flex-col">
            {/* ================= HEADER NAVBAR ================= */}
            <header className="w-full px-4 md:px-6 py-3 flex justify-between items-center border-b border-[#00000012] bg-white sticky top-0 z-40">
                <img
                    src={logo}
                    className="h-8"
                    alt="Smart Deals logo"
                    onClick={() => navigate("/dashboard")}
                />

                {/* Desktop Navigation */}
                {isLoggedIn && user.accountType === "event" && (
                    <nav className="hidden md:flex items-center gap-6">
                        {NAV_LINKS.map(({ label, path, icon: Icon }) => (
                            <button
                                key={path}
                                onClick={() => navigate(path)}
                                className={desktopLinkClass(isActive(path))}
                            >
                                <Icon />
                                {label}
                            </button>
                        ))}
                    </nav>
                )}

                {/* Right actions (visible on mobile & desktop) */}
                <div className="flex gap-3 items-center">
                    {!isLoggedIn ? (
                        <button
                            onClick={openLoginModal}
                            className="text-primary font-medium hover:text-primary/70 text-sm"
                        >
                            Login
                        </button>
                    ) : (
                        <>
                            <img
                                src={user?.region_logo}
                                alt="avatar"
                                className="h-8 w-8 rounded-full bg-gray-200"
                            />

                            <span className="text-sm font-medium hidden sm:inline">
                                {user?.fullName}
                            </span>

                            <button
                                onClick={logout}
                                className="flex items-center gap-1 text-primary hover:text-primary/70 text-sm font-medium"
                            >
                                <FaSignOutAlt />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </>
                    )}
                </div>
            </header>

            {/* ================= MAIN CONTENT ================= */}
            <main className="flex-1 overflow-auto px-4 md:px-0 pb-20 md:pb-6">
                <div className="max-w-4xl mx-auto">{children}</div>
            </main>

            {/* ================= MOBILE BOTTOM NAV ================= */}
            {isLoggedIn && user.accountType === "event" && (
                <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-[#00000012] z-50">
                    <div className="grid grid-cols-2 py-2 ">
                        {NAV_LINKS.map(({ shortLabel, path, icon: Icon }) => (
                            <button
                                key={path}
                                onClick={() => navigate(path)}
                                className={mobileLinkClass(isActive(path))}
                            >
                                <Icon size={18} />
                                {shortLabel}
                            </button>
                        ))}
                    </div>
                </nav>
            )}

            {/* ================= LOGIN MODAL ================= */}
            {openLogin && <LoginForm handleClose={closeLoginModal} />}
        </div>
    );
};
