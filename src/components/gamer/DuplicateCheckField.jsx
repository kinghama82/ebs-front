"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const DuplicateCheckField = ({
                                 label,
                                 type = "text",
                                 name,
                                 value,
                                 onChange,
                                 icon,
                                 onFocus,
                                 onBlur,
                                 onCheck, // 중복 체크 함수
                                 checkButtonLabel = "중복 확인",
                                 message,
                             }) => {
    return (
        <div>
            <Label htmlFor={name} className="text-sm font-semibold text-gray-600">
                {label}
            </Label>
            <div className="flex gap-2">
                <div className="relative flex-grow">
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
                        className="pl-12 h-10 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-md w-full"
                    />
                </div>
                <Button type="button" onClick={onCheck}>
                    {checkButtonLabel}
                </Button>
            </div>
            {message && <p className="text-sm">{message}</p>}
        </div>
    );
};

export default DuplicateCheckField;
