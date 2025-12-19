import Select from "react-select";
import { Controller } from "react-hook-form";

export const CustomSelect = ({
    label,
    id,
    options,
    control,
    name,
    error,
    errorText,
    rules,
    menuHeight = 200,
    ...rest
}) => {
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: "#FFFFFF", // same as BaseInput
            borderColor: error ? "#ff4d4f" : "#ddd",
            borderWidth: "1px",
            borderRadius: "4px",
            minHeight: "44px",
            paddingLeft: "8px",
            boxShadow: state.isFocused ? "0 0 0 1px #e42026" : "none",
            "&:hover": {
                borderColor: "#e42026",
            },
            fontSize: "14px",
            fontWeight: 300,
        }),

        input: (provided) => ({
            ...provided,
            color: "#1E1E1E",
            fontSize: "14px",
            fontWeight: 300,
        }),

        placeholder: (provided) => ({
            ...provided,
            color: "#BAC2D2", // matches BaseInput placeholder
            fontSize: "14px",
            fontWeight: 300,
        }),

        singleValue: (provided) => ({
            ...provided,
            color: "#1E1E1E",
            fontSize: "14px",
            fontWeight: 300,
        }),

        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? "#F0FBFF" : "white",
            color: "#1E1E1E",
            fontSize: "14px",
            padding: "8px",
        }),

        menu: (provided) => ({
            ...provided,
            maxHeight: menuHeight,
            overflowY: "auto",
            zIndex: 9999,
        }),

        menuList: (provided) => ({
            ...provided,
            maxHeight: menuHeight,
            overflowY: "auto",
        }),
    };

    return (
        <div className="w-full relative">
            {/* Floating Label */}
            {label && (
                <label
                    className="inline-block text-[#1E1E1E] text-xs font-light mb-1 absolute -top-2 left-2 px-1 bg-white z-10"
                    htmlFor={id}
                >
                    {label}
                </label>
            )}

            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field }) => (
                    <Select
                        {...field}
                        {...rest}
                        id={id}
                        isSearchable={true}
                        isClearable={true}
                        options={options}
                        styles={customStyles}
                        classNamePrefix="react-select"
                        value={
                            options.find(
                                (option) => option.value === field.value
                            ) || null
                        }
                        onChange={(selectedOption) => {
                            field.onChange(
                                selectedOption ? selectedOption.value : null
                            );
                        }}
                    />
                )}
            />

            {error && errorText && (
                <p className="text-xs text-red-600 mt-1">{errorText}</p>
            )}
        </div>
    );
};
