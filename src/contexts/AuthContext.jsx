import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import storage from "../helpers/storage";

// Create the context with initial undefined
const AuthContext = createContext();

// Custom hook to use the AuthContext safely
export const UseAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("UseAuth must be used within an AuthProvider");
    }
    return context;
};

// Props type for the AuthProvider

export const AuthProvider = ({ children }) => {
    const [openLogin, setOpenLogin] = useState(false);
    const user = storage.getUser();

    const logout = useCallback(() => {
        storage.clearStorage();
        window.location.href = "/dashboard"; // `href` instead of assignment for type
    }, []);

    const value = useMemo(
        () => ({
            user,
            logout,
            openLogin,
            openLoginModal: () => setOpenLogin(true),
            closeLoginModal: () => setOpenLogin(false),
            isLoggedIn: !!user,
        }),
        [user, logout, openLogin, setOpenLogin]
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
