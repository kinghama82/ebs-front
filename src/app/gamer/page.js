"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {Mail, Lock, House} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { loginUser } from "@/api/gamerApi";
import { useSession } from "next-auth/react";
import GoogleLogin from "@/components/jhkexample/GoogleLoginButton";
import axios from "axios";
import NaverLoginButton from "@/components/jhkexample/NaverLoginButton";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태
    const [isModalOpen, setIsModalOpen] = useState(false); // 에러 모달 상태
    const [focusedField, setFocusedField] = useState(""); // 입력 필드 포커스 상태

    const handleChange = (setter) => (e) => {
        setter(e.target.value);
    };

    const handleFocus = (field) => {
        setFocusedField(field);
    };

    const handleBlur = () => {
        setFocusedField("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(email, password);
            console.log("로그인 성공:", data);
            router.push("/");
        } catch (error) {
            setErrorMessage(error.response?.data?.msg || "로그인 실패. 이메일 또는 비밀번호를 확인하세요.");
            setIsModalOpen(true);
        }
    };

    const handleFindId = () => {
        router.push("/gamer/FindIdPage");
    };

    const handleResetPassword = () => {
        router.push("/gamer/ResetPW");
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="w-[400px] shadow-xl rounded-2xl">
                    <CardContent className="p-6">
                        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
                            <Link href="/" className= "w-8 h-8 text-blue-500 hover:text-purple-500 transition duration-300" title="홈으로">
                                <House />
                            </Link>로그인</h2>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <Label htmlFor="email" className="text-sm font-semibold text-gray-600">
                                    이메일
                                </Label>
                                <div className="relative">
                                    {focusedField !== "email" && (
                                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    )}
                                    <Input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={handleChange(setEmail)}
                                        onFocus={() => handleFocus("email")}
                                        onBlur={handleBlur}
                                        required
                                        className="pl-12 h-10 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-md w-full"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="password" className="text-sm font-semibold text-gray-600">
                                    비밀번호
                                </Label>
                                <div className="relative">
                                    {focusedField !== "password" && (
                                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    )}
                                    <Input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={handleChange(setPassword)}
                                        onFocus={() => handleFocus("password")}
                                        onBlur={handleBlur}
                                        required
                                        className="pl-12 h-10 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-md w-full"
                                    />
                                </div>
                            </div>
                            <Button className="w-full mt-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90">
                                로그인
                            </Button>
                        </form>
                        <div className="flex justify-between mt-2.5">
                            <Button onClick={handleFindId} className="w-[48%] bg-purple-500">
                                아이디찾기
                            </Button>
                            <Button onClick={handleResetPassword} className="w-[48%] bg-purple-500">
                                비밀번호 찾기
                            </Button>
                        </div>
                        <div className="mt-3 gap-4">
                            <GoogleLogin/>
                            <NaverLoginButton/>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* 🚀 로그인 실패 모달 */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">로그인 오류</DialogTitle>
                    </DialogHeader>
                    <p className="text-red-600 text-center">{errorMessage}</p>
                    <Button onClick={() => setIsModalOpen(false)} className="mt-4 w-full">
                        확인
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    );
}
