import React from "react";
import { ImSpinner2 } from "react-icons/im";

export const BaseSelect = React.forwardRef(
    (
        {
            children,
            label,
            id,
            handleChange,
            value,
            error,
            errorText,
            loading,
            ...rest
        },
        ref
    ) => {
        return (
            <div className="w-full relative">
                {/* Floating Label - same as BaseInput */}
                {label && (
                    <label
                        className="inline-block text-[#1E1E1E] text-xs font-light mb-1 absolute -top-2 left-2 px-1 bg-white z-10"
                        htmlFor={id}
                    >
                        {label}
                    </label>
                )}

                <div className="relative">
                    <select
                        id={id}
                        value={value}
                        onChange={handleChange}
                        ref={ref}
                        {...rest}
                        className={`disabled:opacity-75 disabled:text-gray-600 w-full px-3 py-3 bg-white text-black text-sm font-light rounded-sm border
                            placeholder:text-[#BAC2D2]
                            ${error ? "border-red-500" : "border-[#D0D5DD]"}
                            focus:outline-primary focus:border-primary pr-10`}
                    >
                        {children}
                    </select>

                    {/* Loading spinner */}
                    {loading && (
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <ImSpinner2 className="animate-spin text-primary text-lg" />
                        </div>
                    )}
                </div>

                {error && errorText && (
                    <p className="text-xs text-red-600 mt-1">{errorText}</p>
                )}
            </div>
        );
    }
);

BaseSelect.displayName = "BaseSelect";
