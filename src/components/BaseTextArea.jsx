import React, { useState } from "react";

export const BaseTextArea = React.forwardRef(
    (
        {
            label,
            id,
            handleChange,
            value,
            error,
            errorText,
            hasHint,
            hint,
            rows = 4,
            ...rest
        },
        ref
    ) => {
        return (
            <div className="w-full relative">
                {/* Label */}
                {label && (
                    <label
                        className="inline-block text-[#1E1E1E] text-xs font-light mb-1 absolute -top-2 left-2 px-1 bg-white"
                        htmlFor={id}
                    >
                        {label}
                    </label>
                )}

                {/* Hint Tooltip */}
                {hasHint && (
                    <p className="absolute top-0 right-0 text-right group">
                        <span className="cursor-pointer text-blue-900 text-sm">
                            &#9432;
                        </span>

                        <span className="absolute z-10 p-2 text-white bg-primary rounded-md -top-2 right-0 transform scale-0 group-hover:scale-100 origin-right transition-transform duration-200 text-tiny text-nowrap">
                            {hint}
                        </span>
                    </p>
                )}

                {/* Textarea Field */}
                <textarea
                    ref={ref}
                    id={id}
                    value={value}
                    onChange={handleChange}
                    rows={rows}
                    className="disabled:opacity-75 disabled:text-gray-600 w-full px-3 py-3 text-black rounded-sm focus:outline-primary focus:border-primary font-light bg-white text-sm placeholder:text-[#BAC2D2] border border-[#D0D5DD] resize-none"
                    {...rest}
                />

                {/* Error Message */}
                {error && errorText && (
                    <p className="text-xs text-red-600 mt-1">{errorText}</p>
                )}
            </div>
        );
    }
);

BaseTextArea.displayName = "BaseTextArea";
