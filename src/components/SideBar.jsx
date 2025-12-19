import { Link, useLocation } from "react-router";
import {
    FaHome,
    FaTag,
    FaShoppingBag,
    FaMapMarkedAlt,
    FaBars,
} from "react-icons/fa";

export function SideBar() {
    const location = useLocation();

    // Function to determine if the current path matches the link
    const isActive = (path) => {
        return location.pathname === path
            ? "text-primary"
            : "text-gray-400 hover:text-primary/70";
    };

    // Array of links with path, label, and icon
    const links = [
        { path: "/dashboard", label: "Home", icon: <FaHome size={20} /> },
        { path: "/discounts", label: "Discounts", icon: <FaTag size={20} /> },
        { path: "/deals", label: "Deals", icon: <FaShoppingBag size={20} /> },
        {
            path: "/events",
            label: "Events",
            icon: <FaMapMarkedAlt size={20} />,
        },
        { path: "/options", label: "Options", icon: <FaBars size={20} /> },
    ];

    return (
        <nav className="flex flex-col items-center w-[200px] h-full py-4 rounded-[20px] space-y-6 border border-[#00000012]">
            {links.map(({ path, label, icon }) => (
                <Link
                    key={path}
                    to={path}
                    className={`flex w-[80%] items-center gap-4 py-2 px-4 transition-all ease-in-out duration-300 rounded-md ${isActive(
                        path
                    )}`}
                >
                    {icon}
                    <span className="text-sm">{label}</span>
                </Link>
            ))}
        </nav>
    );
}
