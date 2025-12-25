import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Modal } from "./Modal";
import { BaseInput } from "./BaseInput";
import { BaseButton } from "./BaseButton";
import { useLogin, useGetSigmaKey } from "../hooks/EventsHooks";
import { hashPassword } from "../helpers/encryption";
import storage from "../helpers/storage";

export const LoginForm = ({ handleClose, handleLogin }) => {
    const { mutateAsync, isPending } = useLogin();
    const { mutateAsync: getSigmaKey, isPending: gettingSigmaKey } =
        useGetSigmaKey();
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const onSubmit = async (data) => {
        try {
            const res = await mutateAsync({
                username: data.username,
                password: hashPassword({
                    username: data.username,
                    password: data.password,
                }).hash512,
                bizFrom: "SMARTDEALS",
                deviceType: "web",
                region: "NG",
            });

            storage.setUser(res?.data);
            storage.setToken(res?.data?.accessToken);
            const sigma = await getSigmaKey({
                username: data.username,
                password: hashPassword({
                    username: data.username,
                    password: data.password,
                }).hash512,
                bizFrom: "SMARTDEALS",
                deviceType: "web",
                region: "NG",
                accountType: res.data.accountType,
            });
            localStorage.setItem("sigma", sigma.private_key);
            setTimeout(() => {
                handleClose();
            }, 500);
        } catch (error) {
            console.log(error);
            alert(error.response.data.message || "An error occured");
        }
    };

    return (
        <Modal
            title="Please login to your account"
            handleClose={handleClose}
            maxWidth={500}
        >
            {/* <div className="text-center mb-6">
                {logoSrc ? (
                    <img
                        src={logoSrc}
                        alt="Logo"
                        className="mx-auto mb-4 w-32 h-32"
                    />
                ) : (
                    <h1 className="text-3xl font-bold text-blue-600 mb-4">
                        Your Logo
                    </h1>
                )}
            </div> */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Username Input */}
                <Controller
                    name="username"
                    control={control}
                    rules={{
                        required: "Username is required",
                        minLength: {
                            value: 4,
                            message:
                                "Username must be at least 4 characters long",
                        },
                    }}
                    render={({ field }) => (
                        <BaseInput
                            label="Username"
                            {...field}
                            error={errors.username}
                            errorText={errors.username?.message}
                        />
                    )}
                />

                {/* Password Input */}
                <Controller
                    name="password"
                    control={control}
                    rules={{
                        required: "Password is required",
                        minLength: {
                            value: 6,
                            message:
                                "Password must be at least 6 characters long",
                        },
                    }}
                    render={({ field }) => (
                        <BaseInput
                            label="Password"
                            type="password"
                            {...field}
                            error={errors.password}
                            errorText={errors.password?.message}
                            canTogglePassword
                        />
                    )}
                />

                {/* Submit Button */}
                <BaseButton type="submit" loading={isPending}>
                    Log In
                </BaseButton>
            </form>
        </Modal>
    );
};
