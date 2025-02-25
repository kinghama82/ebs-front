"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { newgamer } from "../../../../src/api/gamerApi";

const SignupPage = () => {
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

    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await newgamer(formData);
            alert("회원가입 성공!");
            router.push("/login");
        } catch (error) {
            alert(`회원가입 실패: ${error.response?.data?.msg || "서버 오류"}`);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 ">
            <div className="w-full max-w-md p-4 shadow-xl bg-white">
                <h2 className="text-2xl font-bold mb-4">회원가입</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input className="w-full p-2 border rounded" name="name" placeholder="이름" value={formData.name} onChange={handleChange} required />
                    <input className="w-full p-2 border rounded" name="age" placeholder="나이" type="number" value={formData.age} onChange={handleChange} required />
                    <input className="w-full p-2 border rounded" name="email" type="email" placeholder="이메일" value={formData.email} onChange={handleChange} required />
                    <input className="w-full p-2 border rounded" name="password1" type="password" placeholder="비밀번호" value={formData.password1} onChange={handleChange} required />
                    <input className="w-full p-2 border rounded" name="password2" type="password" placeholder="비밀번호 확인" value={formData.password2} onChange={handleChange} required />
                    <input className="w-full p-2 border rounded" name="nickname" placeholder="닉네임" value={formData.nickname} onChange={handleChange} required />
                    <input className="w-full p-2 border rounded" name="phone" placeholder="전화번호" value={formData.phone} onChange={handleChange} required />
                    <input className="w-full p-2 border rounded" name="address" placeholder="주소" value={formData.address} onChange={handleChange} />
                    <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded mt-4">
                        회원가입
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
