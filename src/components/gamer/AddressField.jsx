"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import AddressSearch from "@/components/gamer/AddressSearch";

const AddressField = ({ address, detailAddress, onAddressSelect, onDetailChange }) => {
    return (
        <div>
            <Label className="text-sm font-semibold text-gray-600">주소</Label>
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={address}
                    readOnly
                    className="border p-2 w-full rounded-md bg-gray-100"
                />
                <AddressSearch onSelect={onAddressSelect} />
            </div>
            <Label className="text-sm font-semibold text-gray-600 mt-2">상세주소</Label>
            <input
                type="text"
                value={detailAddress}
                onChange={onDetailChange}
                className="border p-2 w-full rounded-md"
            />
        </div>
    );
};

export default AddressField;
