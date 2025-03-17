"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { resetPassword } from "@/api/gamerApi";

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token") || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isResetSuccess, setIsResetSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setMessage("유효한 토큰이 없습니다. 비밀번호 재설정 링크를 다시 요청해주세요.");
            setIsModalOpen(true);
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) return;
        if (newPassword !== confirmPassword) {
            setMessage("비밀번호가 일치하지 않습니다.");
            setIsModalOpen(true);
            return;
        }
        try {
            const data = await resetPassword(token, newPassword, confirmPassword);
            setMessage(data.msg);
            setIsResetSuccess(true);
        } catch (error) {
            console.error("비밀번호 재설정 오류:", error);
            if (error.response && error.response.data && error.response.data.msg) {
                setMessage(error.response.data.msg);
            } else {
                setMessage("서버와 연결할 수 없습니다.");
            }
        }
        setIsModalOpen(true);
    };

    const handleLogin = () => {
        router.push("/gamer");
    };

    const handleHome = () => {
        router.push("/");
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-[400px] shadow-xl rounded-2xl">
                <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">비밀번호 재설정</h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <Label htmlFor="newPassword" className="text-sm font-semibold text-gray-600">
                                새 비밀번호
                            </Label>
                            <Input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md w-full"
                            />
                        </div>
                        <div>
                            <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-600">
                                새 비밀번호 확인
                            </Label>
                            <Input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md w-full"
                            />
                        </div>
                        <Button type="submit" className="w-full mt-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90">
                            비밀번호 재설정
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
                    {isResetSuccess ? (
                        <div className="flex gap-4 mt-4">
                            <Button onClick={handleLogin} className="w-1/2 bg-green-500 hover:opacity-90">
                                로그인하기
                            </Button>
                            <Button onClick={handleHome} className="w-1/2 bg-gray-500 hover:opacity-90">
                                홈으로
                            </Button>
                        </div>
                    ) : (
                        <Button onClick={() => setIsModalOpen(false)} className="mt-4 w-full bg-gray-500 hover:opacity-90">
                            확인
                        </Button>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
