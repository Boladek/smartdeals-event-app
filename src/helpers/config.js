export const configKeys = {
    apiHost:
        import.meta.env.VITE_APP_ENVIRONMENT === "development"
            ? "https://core-staging.smartdeals.com.ng"
            : "https://core.smartdeals.com.ng",
    wssHost:
        import.meta.env.VITE_APP_ENVIRONMENT === "development"
            ? "https://socket-staging.smartdeals.com.ng"
            : "https://socket.smartdeals.com.ng",
    encryptionPassword:
        import.meta.env.VITE_APP_ENVIRONMENT === "development"
            ? import.meta.env.VITE_APP_ENCRYPTION_PASSWORD_DEV
            : import.meta.env.VITE_APP_ENCRYPTION_PASSWORD,
    encryptionSecretKey:
        import.meta.env.VITE_APP_ENVIRONMENT === "development"
            ? import.meta.env.VITE_APP_ENCRYPTION_SECRETKEY_DEV
            : import.meta.env.VITE_APP_ENCRYPTION_SECRETKEY,
    paymentSecret:
        import.meta.env.VITE_APP_ENVIRONMENT === "development"
            ? import.meta.env.VITE_APP_SECRET_DEV
            : import.meta.env.VITE_APP_SECRET,
    agencyKey:
        import.meta.env.VITE_APP_ENVIRONMENT === "development"
            ? import.meta.env.VITE_APP_AGENCY_DEV
            : import.meta.env.VITE_APP_AGENCY,
            
};
