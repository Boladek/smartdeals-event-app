import { useCallback } from "react";

export const ShareHook = () => {
    const isSupported = typeof navigator !== "undefined" && !!navigator.share;

    const share = useCallback(
        async ({ title, text, url }) => {
            if (!isSupported) {
                console.warn("Web Share API is not supported in this browser.");
                return false;
            }

            try {
                await navigator.share({ title, text, url });
                return true;
            } catch (error) {
                console.error("Error sharing:", error);
                return false;
            }
        },
        [isSupported]
    );

    return { isSupported, share };
};
