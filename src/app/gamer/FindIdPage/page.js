"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_SERVER_HOST } from "@/api/publicapi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {House} from "lucide-react";
import Link from "next/link";

export default function FindIdPage() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                `${API_SERVER_HOST}/api/gamer/find-id`,
                { name, phone },
                { headers: { "Content-Type": "application/json" } }
            );
            // data.msg와 data.email가 함께 전송된 경우
            const displayMessage = data.email
                ? `${data.msg}  ${data.email}`
                : data.msg;
            setMessage(displayMessage);
        } catch (error) {
            console.error("아이디 찾기 오류:", error);
            setMessage("서버와 연결할 수 없습니다.");
        }
        setIsModalOpen(true);
    };

    const handleLogin = () => {
        router.push("/gamer");
    };

    const handleResetPW = () => {
        router.push("/gamer/ResetPW");
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-[400px] shadow-xl rounded-2xl">
                <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
                        <Link href="/" className= "w-8 h-8 text-blue-500 hover:text-purple-500 transition duration-300" title="홈으로">
                            <House />
                        </Link>
                        아이디 찾기</h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <Label htmlFor="name" className="text-sm font-semibold text-gray-600">
                                이름
                            </Label>
                            <Input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md w-full"
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone" className="text-sm font-semibold text-gray-600">
                                전화번호
                            </Label>
                            <Input
                                type="text"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md w-full"
                            />
                        </div>
                        <Button type="submit" className="w-full mt-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90">
                            아이디 찾기
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">알림</DialogTitle>
                    </DialogHeader>
                    <p className="text-center">{message}</p>
                    <div className="flex gap-4 mt-4">
                        <Button onClick={handleLogin} className="w-1/2 bg-green-500 hover:opacity-90">
                            로그인하기
                        </Button>
                        <Button onClick={handleResetPW} className="w-1/2 bg-blue-500 hover:opacity-90">
                            비밀번호 초기화
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
