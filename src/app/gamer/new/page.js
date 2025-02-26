// /app/gamer/GamerForm.jsx
"use client";

import React, { useState } from "react";
import { newgamer } from "../../../api/gamerApi";

const GamerForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        email: "",
        password1: "",
        password2: "",
        nickname: "",
        phone: "",
        address: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await newgamer(formData);
            alert("새 게이머가 등록되었습니다.");
            console.log(result);
        } catch (error) {
            console.error("게이머 등록에 실패했습니다.", error);
        }
    };

    return (
        <form className="p-4 bg-white rounded-lg shadow-md" onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-2">새 게이머 등록</h2>
            {Object.keys(formData).map((key) => (
                <div key={key} className="mb-2">
                    <label className="block mb-1 capitalize">{key}</label>
                    <input
                        type="text"
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                        required
                    />
                </div>
            ))}
            <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
            >
                등록하기
            </button>
        </form>
    );
};

export default GamerForm;
