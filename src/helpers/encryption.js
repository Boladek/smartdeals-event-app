import CryptoJS from "crypto-js";
import { configKeys } from "./config";

const { encryptionPassword, encryptionSecretKey } = configKeys;

export function hashPassword({ username, password }) {
    const md5hash = CryptoJS.MD5(password).toString(); // Step 1: MD5 the password
    const input = `${username.toLowerCase()}:${md5hash}`; // Step 2: Combine
    const hash512 = CryptoJS.SHA512(input).toString(); // Step 3: SHA512 the result

    return { hash512, md5hash };
}

export function encryption(payload) {
    const stringifiedPayload = JSON.stringify(payload);
    const password = encryptionPassword;
    const secretKey = encryptionSecretKey;

    const hash = CryptoJS.PBKDF2(
        password,
        CryptoJS.enc.Utf16LE.parse(secretKey),
        {
            keySize: 32,
            iterations: 1000,
            hasher: CryptoJS.algo.SHA1,
        }
    ).toString(CryptoJS.enc.Hex);

    const key = hash.substring(0, 64);
    const iv = hash.substring(0, 42);

    const encryptionOptions = {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    };

    const encrypted = CryptoJS.AES.encrypt(
        CryptoJS.enc.Utf16LE.parse(stringifiedPayload),
        CryptoJS.enc.Hex.parse(key),
        encryptionOptions
    );

    return encrypted.toString();
}

export function decryption(encryptedData) {
    const password = encryptionPassword;
    const secretKey = encryptionSecretKey;

    const hash = CryptoJS.PBKDF2(
        password,
        CryptoJS.enc.Utf16LE.parse(secretKey),
        {
            keySize: 256 / 32,
            iterations: 1000,
            hasher: CryptoJS.algo.SHA1,
        }
    ).toString(CryptoJS.enc.Hex);

    const key = hash.substring(0, 64);
    const iv = hash.substring(0, 42);

    const encryptionOptions = {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    };

    const decrypted = CryptoJS.AES.decrypt(
        encryptedData,
        CryptoJS.enc.Hex.parse(key),
        encryptionOptions
    );
    const stringifiedDecrypted = CryptoJS.enc.Utf16LE.stringify(decrypted);
    // return JSON.parse(CryptoJS.enc.Utf16LE.stringify(decrypted));
    return JSON.parse(stringifiedDecrypted.trim());
}

export function paymentEncryption(payload) {
    const stringifiedPayload = JSON.stringify(payload);
    const password =
        import.meta.env.VITE_APP_ENVIRONMENT === "development"
            ? import.meta.env.VITE_APP_AGENCY_DEV
            : import.meta.env.VITE_APP_AGENCY;
    const secretKey =
        import.meta.env.VITE_APP_ENVIRONMENT === "development"
            ? import.meta.env.VITE_APP_SECRET_DEV
            : import.meta.env.VITE_APP_SECRET;

    const hash = CryptoJS.PBKDF2(
        password,
        CryptoJS.enc.Utf16LE.parse(secretKey),
        {
            keySize: 32,
            iterations: 1000,
            hasher: CryptoJS.algo.SHA1,
        }
    ).toString(CryptoJS.enc.Hex);

    const key = hash.substring(0, 64);
    const iv = hash.substring(0, 42);

    const encryptionOptions = {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    };

    const encrypted = CryptoJS.AES.encrypt(
        CryptoJS.enc.Utf16LE.parse(stringifiedPayload),
        CryptoJS.enc.Hex.parse(key),
        encryptionOptions
    );

    return encrypted.toString();
}

export function paymentDecryption(encryptedData) {
    // const password = import.meta.env.VITE_APP_AGENCY;
    // const secretKey = import.meta.env.VITE_APP_SECRET;
    const password =
        import.meta.env.VITE_APP_ENVIRONMENT === "development"
            ? import.meta.env.VITE_APP_AGENCY_DEV
            : import.meta.env.VITE_APP_AGENCY;
    const secretKey =
        import.meta.env.VITE_APP_ENVIRONMENT === "development"
            ? import.meta.env.VITE_APP_SECRET_DEV
            : import.meta.env.VITE_APP_SECRET;

    const hash = CryptoJS.PBKDF2(
        password,
        CryptoJS.enc.Utf16LE.parse(secretKey),
        {
            keySize: 256 / 32,
            iterations: 1000,
            hasher: CryptoJS.algo.SHA1,
        }
    ).toString(CryptoJS.enc.Hex);

    const key = hash.substring(0, 64);
    const iv = hash.substring(0, 42);

    const encryptionOptions = {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    };

    const decrypted = CryptoJS.AES.decrypt(
        encryptedData,
        CryptoJS.enc.Hex.parse(key),
        encryptionOptions
    );
    const stringifiedDecrypted = CryptoJS.enc.Utf16LE.stringify(decrypted);
    // return JSON.parse(CryptoJS.enc.Utf16LE.stringify(decrypted));
    return JSON.parse(stringifiedDecrypted.trim());
}
