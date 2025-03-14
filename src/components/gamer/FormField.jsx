// src/components/gamer/FormField.jsx
"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FormField = ({
                       label,
                       type = "text",
                       name,
                       value,
                       onChange,
                       icon,
                       onFocus,
                       onBlur,
                       placeholder,
                       error, // <-- 추가: 에러 메시지 prop
                   }) => {
    return (
        <div>
            <Label htmlFor={name} className="text-sm font-semibold text-gray-600">
                {label}
            </Label>
            <div className="relative">
                {!value && icon && (
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {icon}
                    </div>
                )}
                <Input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className="pl-12 h-10 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-md w-full"
                />
            </div>
            {/* 에러 메시지 표시 */}
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
    );
};

export default FormField;
