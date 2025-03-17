"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { requestPasswordReset } from "@/api/gamerApi";
import {House} from "lucide-react";
import Link from "next/link";

export default function RequestPasswordResetPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await requestPasswordReset(name, email);
            setMessage(data.msg);
        } catch (error) {
            console.error("비밀번호 재설정 요청 오류:", error);
            setMessage("서버와 연결할 수 없습니다.");
        }
        setIsModalOpen(true);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-[400px] shadow-xl rounded-2xl">
                <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
                        <Link href="/" className= "w-8 h-8 text-blue-500 hover:text-purple-500 transition duration-300" title="홈으로">
                            <House />
                        </Link>
                        비밀번호 재설정 요청
                    </h2>
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
                            <Label htmlFor="email" className="text-sm font-semibold text-gray-600">
                                이메일
                            </Label>
                            <Input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md w-full"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full mt-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
                        >
                            재설정 링크 전송
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
                    <Button
                        onClick={() => setIsModalOpen(false)}
                        className="mt-4 w-full bg-gray-500 hover:opacity-90"
                    >
                        확인
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    );
}
