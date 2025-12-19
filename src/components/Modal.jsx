import { useEffect } from "react";
import { FaArrowCircleLeft } from "react-icons/fa";

export function Modal({
    children,
    handleClose,
    title,
    maxWidth = 400,
    canClose = false,
}) {
    const handleClick = (e) => {
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
            className="fixed top-0 left-0 w-full h-full p-4 flex items-center justify-center bg-[#51515166] bg-opacity-70 backdrop-blur-xs backdrop-brightness-100"
            style={{ zIndex: 50 }}
            onClick={handleClick}
        >
            <div
                className="bg-primary rounded-xl relative flex flex-col max-h-[90vh]"
                style={{ width: "100%", maxWidth }}
            >
                <div
                    className="flex justify-between gap-4 items-center p-4 pb-8 w-full rounded-t-xl bg-primary text-white"
                    style={{ zIndex: 101 }}
                >
                    <div
                        onClick={handleClose}
                        className="cursor-pointer text-3xl text-white hover:text-gray-400"
                    >
                        <FaArrowCircleLeft />
                    </div>
                    <div className="flex-1 text-xl font-semibold">{title}</div>
                </div>
                <div
                    className="sm:p-8 p-4 rounded-2xl -mt-4 bg-white dark:bg-dark w-full flex-1 overflow-y-auto"
                    style={{ zIndex: 102 }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
