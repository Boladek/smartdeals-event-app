import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useCallback,
} from "react";
import { io } from "socket.io-client";
import PropTypes from "prop-types";
import { configKeys } from "../helpers/config";

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
    const ctx = useContext(WebSocketContext);
    if (!ctx)
        throw new Error("useWebSocket must be used within WebSocketProvider");
    return ctx;
};

export const WebSocketProvider = ({ children }) => {
    const socketRef = useRef(null);

    // ✅ Store initiation refs in a Set (fast lookup, no duplicates)
    const initiationRefSet = useRef(new Set());

    /**
     * 🔁 Generic response parser
     * Handles stringified JSON payloads
     */
    const parseSocketPayload = useCallback((payload) => {
        if (!payload) return null;

        if (typeof payload === "object") return payload;

        if (typeof payload === "string") {
            try {
                return JSON.parse(payload);
            } catch (e) {
                console.error("Failed to parse socket payload:", payload);
                return null;
            }
        }

        return null;
    }, []);

    /**
     * 🔔 Wallet balance handler
     */
    const onWalletBalance = useCallback(
        (rawPayload, callback) => {
            const parsed = parseSocketPayload(rawPayload);
            if (!parsed || parsed.method !== "wallet_balance") return;

            callback?.(parsed.data || []);
        },
        [parseSocketPayload]
    );

    /**
     * 💳 Payment status handler
     * Stores initiationTranRef in a Set
     */
    const onPaymentStatus = useCallback(
        (rawPayload, callback) => {
            const parsed = parseSocketPayload(rawPayload);
            if (!parsed || parsed.method !== "payment_status") return;

            const refs = parsed.data || [];

            refs.forEach((item) => {
                if (item?.initiationTranRef) {
                    initiationRefSet.current.add(item.initiationTranRef);
                }
            });

            callback?.(refs);
        },
        [parseSocketPayload]
    );

    /**
     * 🔍 Helper: check if initiation ref exists
     */
    const hasInitiationRef = useCallback((ref) => {
        return initiationRefSet.current.has(ref);
    }, []);

    /**
     * 📦 Helper: get all refs (debug / optional UI)
     */
    const getAllInitiationRefs = useCallback(() => {
        return Array.from(initiationRefSet.current);
    }, []);

    useEffect(() => {
        if (socketRef.current) return;

        const socket = io(configKeys.wssHost, {
            path: "/ws/pay/socket.io",
            transports: ["websocket"],
            reconnection: true,
        });

        socketRef.current = socket;

        socket.on("connect", () =>
            console.log("🔌 Socket connected:", socket.id)
        );

        socket.on("disconnect", (reason) =>
            console.warn("⚠️ Socket disconnected:", reason)
        );

        socket.on("connect_error", (err) =>
            console.error("❌ Socket error:", err)
        );

        socket.on("wallet_balance", (payload) => {
            onWalletBalance(payload);
        });

        socket.on("payment_status", (payload) => {
            onPaymentStatus(payload);
        });

        return () => {
            socket.off();
            socket.disconnect();
            socketRef.current = null;
        };
    }, [onWalletBalance, onPaymentStatus]);

    const value = useMemo(
        () => ({
            socket: socketRef.current,
            isConnected: !!socketRef.current?.connected,

            // listeners
            onWalletBalance,
            onPaymentStatus,

            // helpers
            hasInitiationRef,
            getAllInitiationRefs,
        }),
        [
            onWalletBalance,
            onPaymentStatus,
            hasInitiationRef,
            getAllInitiationRefs,
        ]
    );

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};

WebSocketProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
