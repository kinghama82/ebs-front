import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const PhoneDuplicateCheckField = ({
                                      label,
                                      name,
                                      value,
                                      onChange,
                                      onCheck,
                                      message,
                                      buttonLabel = "중복 확인",
                                  }) => {
    // 숫자만 입력받기 & 자동 하이픈 적용
    const handleInputChange = (e) => {
        let input = e.target.value.replace(/\D/g, ""); // 숫자만 남김
        if (input.startsWith("010")) {
            input = input.slice(3); // "010"이 중복 입력되는 경우 제거
        }
        input = input.slice(0, 8); // 8자리 제한

        // 자동 하이픈 적용 (4자리 이상 입력 시)
        let formattedValue = `010`;
        if (input.length > 0) {
            formattedValue += `-${input.slice(0, 4)}`;
        }
        if (input.length > 4) {
            formattedValue += `-${input.slice(4)}`;
        }

        onChange({ target: { name, value: formattedValue } });
    };

    return (
        <div className="mb-4">
            <Label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label}
            </Label>
            <div className="mt-1 flex">
                <Input
                    id={name}
                    name={name}
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    placeholder="010-0000-0000"
                    maxLength={13} // 010-0000-0000 (13자)
                    className="block w-full text-lg font-medium border-gray-300 rounded-md"
                />
                <Button type="button" onClick={onCheck} className="ml-2 whitespace-nowrap">
                    {buttonLabel}
                </Button>
            </div>
            {message && <p className="mt-1 text-sm text-gray-500">{message}</p>}
        </div>
    );
};

export default PhoneDuplicateCheckField;
