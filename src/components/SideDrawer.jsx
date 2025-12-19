import { useEffect } from "react";
import { FaArrowCircleLeft } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

export function SideDrawer({
    children,
    handleClose,
    title,
    width = 400, // adjustable width
    canClose = true,
}) {
    const handleBackdropClick = (e) => {
        e.stopPropagation();
        if (e.target === e.currentTarget && canClose) {
            handleClose();
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && canClose) {
                handleClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [canClose, handleClose]);

    return (
        <div
            className="fixed inset-0 flex justify-end bg-[#51515166] bg-opacity-70 backdrop-blur-xs backdrop-brightness-100"
            style={{ zIndex: 50 }}
            onClick={handleBackdropClick}
        >
            {/* Drawer */}
            <div
                className="relative flex h-screen max-h-screen w-full bg-white dark:bg-dark shadow-xl flex-col"
                style={{ maxWidth: width }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b bg-primary text-white">
                    {/* Optional back arrow (like your Modal) */}
                    <button
                        type="button"
                        onClick={handleClose}
                        className="mr-2 text-2xl hover:text-gray-300"
                    >
                        <FaArrowCircleLeft />
                    </button>

                    <h2 className="flex-1 text-xl font-semibold">{title}</h2>
                </div>

                {/* Content (scrollable) */}
                <div className="flex-1 overflow-y-auto p-4">{children}</div>
            </div>
        </div>
    );
}
