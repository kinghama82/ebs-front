"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginPost } from "../../api/loginAPI";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginPost({ email, password });

            // accessToken 존재 여부로 로그인 성공을 판단
            if (response?.accessToken) {
                alert("로그인 성공!");
                localStorage.setItem("token", response.accessToken);
                router.push("/");
            } else {
                alert("로그인 실패: 서버에서 올바른 응답을 받지 못했습니다.");
                console.log("서버 응답 데이터:", response);
            }
        } catch (error) {
            alert("로그인 오류 발생: " + error.message);
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6">
                <CardContent>
                    <h2 className="text-2xl font-semibold mb-4">로그인</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block mb-1">이메일</label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="이메일을 입력하세요"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">비밀번호</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호를 입력하세요"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            로그인
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;
