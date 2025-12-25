import { Link, useLocation, useNavigate } from "react-router";
import {
    FaHome,
    FaTag,
    FaShoppingBag,
    FaMapMarkedAlt,
    FaBars,
} from "react-icons/fa";

const desktopLinkClass = (active) =>
    [
        "w-full px-4 py-2 rounded-lg",
        "inline-flex items-center justify-start gap-3", // ✅ alignment
        "text-sm font-semibold transition-colors",
        active
            ? "text-primary bg-primary/10"
            : "text-gray-700 hover:text-primary hover:bg-gray-50",
    ].join(" ");

export function SideBar({ links }) {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname.includes(path);

    return (
        <nav className="flex flex-col items-center w-[200px] h-full p-4 rounded-[20px] space-y-6 border border-[#00000012]">
            {links.map(({ path, label, icon: Icon }) => (
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
    );
}
