//src/app/gamer/new/page.js
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { newGamer, checkEmailExists, checkNicknameExists } from "@/api/gamerApi";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {Mail, Lock, Phone, User, KeyRound, Calendar, Dices} from "lucide-react";
import FormField from "@/components/gamer/FormField";
import DuplicateCheckField from "@/components/gamer/DuplicateCheckField";
import AddressField from "@/components/gamer/AddressField";
import ModalDialog from "@/components/gamer/ModalDialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { House } from "lucide-react";

const GamerForm = () => {
    const router = useRouter();
    const [password1Error, setPassword1Error] = useState("");
    const [password2Error, setPassword2Error] = useState("");
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

    // 중복 체크 상태
    const [emailChecked, setEmailChecked] = useState(false);
    const [nicknameChecked, setNicknameChecked] = useState(false);
    const [emailMessage, setEmailMessage] = useState("");
    const [nicknameMessage, setNicknameMessage] = useState("");

    // 모달 관련 상태
    const [errorMessage, setErrorMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [successModal, setSuccessModal] = useState(false);

    // 주소 관련 상태
    const [address, setAddress] = useState("");
    const [detailAddress, setDetailAddress] = useState("");

    // 라벨/아이콘 설정
    const fieldLabels = {
        name: "이름",
        email: "이메일",
        nickname: "닉네임",
        age: "나이",
        password1: "비밀번호",
        password2: "비밀번호 확인",
        phone: "핸드폰번호",
    };

    const fieldIcons = {
        name: <User size={18} />,
        email: <Mail size={18} />,
        nickname: <KeyRound size={18} />,
        age: <Calendar size={18} />,
        password1: <Lock size={18} />,
        password2: <Lock size={18} />,
        phone: <Phone size={18} />,
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // 공통 formData 업데이트
        setFormData((prev) => ({ ...prev, [name]: value }));

        // 이메일, 닉네임 중복 체크 상태 초기화
        if (name === "email") {
            setEmailChecked(false);
            setEmailMessage("");
        }
        if (name === "nickname") {
            setNicknameChecked(false);
            setNicknameMessage("");
        }

        // 비밀번호1 유효성 검사
        if (name === "password1") {
            // 비어있거나 정규식 불일치인 경우 동일 메시지
            if (
                !value || // <-- 비어있는 경우
                !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value) // 패턴 불일치
            ) {
                setPassword1Error("비밀번호는 6자 이상이며, 알파벳과 숫자를 포함해야 합니다.");
            } else {
                setPassword1Error("");
            }

            // password2가 이미 입력되어 있으면, 비밀번호가 달라졌을 수 있으므로 재검사
            if (formData.password2 && value !== formData.password2) {
                setPassword2Error("비밀번호가 일치하지 않습니다.");
            } else {
                setPassword2Error("");
            }
        }

    };

    const handlePhoneChange = (e) => {
        // 숫자 이외 문자 제거
        let value = e.target.value.replace(/\D/g, "");
        // 최대 11자리로 제한
        if (value.length > 11) {
            value = value.slice(0, 11);
        }

        // 하이픈(-) 삽입 로직
        // 010-1234-5678 형태
        if (value.length > 3 && value.length <= 7) {
            // 010-1234
            value = value.slice(0, 3) + "-" + value.slice(3);
        } else if (value.length > 7) {
            // 010-1234-5678
            value = value.slice(0, 3) + "-" + value.slice(3, 7) + "-" + value.slice(7);
        }

        setFormData((prev) => ({ ...prev, phone: value }));
    };


    const handleCheckEmail = async () => {
        if (!formData.email) {
            setEmailMessage("이메일을 입력해주세요.");
            return;
        }
        try {
            const exists = await checkEmailExists(formData.email);
            if (exists) {
                setEmailMessage("❌ 이미 사용 중인 이메일입니다.");
                setEmailChecked(false);
            } else {
                setEmailMessage("✅ 사용 가능한 이메일입니다.");
                setEmailChecked(true);
            }
        } catch (error) {
            setEmailMessage("오류 발생");
        }
    };

    const handleCheckNickname = async () => {
        if (!formData.nickname) {
            setNicknameMessage("닉네임을 입력해주세요.");
            return;
        }
        try {
            const exists = await checkNicknameExists(formData.nickname);
            if (exists) {
                setNicknameMessage("❌ 이미 사용 중인 닉네임입니다.");
                setNicknameChecked(false);
            } else {
                setNicknameMessage("✅ 사용 가능한 닉네임입니다.");
                setNicknameChecked(true);
            }
        } catch (error) {
            setNicknameMessage("오류 발생");
        }
    };

    const handleAddressSelect = (selectedAddress) => {
        setAddress(selectedAddress);
        setFormData((prev) => ({ ...prev, address: selectedAddress }));
    };

    const handleDetailAddressChange = (e) => {
        setDetailAddress(e.target.value);
    };

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            address: detailAddress ? `${address} ${detailAddress}` : address,
        }));
    }, [address, detailAddress]);

    const validateForm = () => {
        if (!formData.name) return "이름을 입력해주세요.";
        if (!formData.email) return "이메일을 입력해주세요.";
        if (!emailChecked) return "이메일 중복 확인을 해주세요.";
        if (!formData.nickname) return "닉네임을 입력해주세요.";
        if (!nicknameChecked) return "닉네임 중복 확인을 해주세요.";
        if (!formData.age) return "나이를 입력해주세요.";
        if (!formData.password1) return "비밀번호를 입력해주세요.";
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(formData.password1)) {
            return "비밀번호는 6자 이상이며, 알파벳과 숫자를 포함해야 합니다.";
        }
        if (formData.password1 !== formData.password2) return "비밀번호가 일치하지 않습니다.";
        if (!formData.phone) return "핸드폰번호를 입력해주세요.";
        if (!formData.address) return "주소를 입력해주세요.";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setErrorMessage(validationError);
            setIsModalOpen(true);
            return;
        }
        try {
            await newGamer(formData);
            setSuccessModal(true);
        } catch (error) {
            console.error("게이머 등록 실패:", error);
            setErrorMessage("회원가입 중 오류가 발생했습니다.");
            setIsModalOpen(true);
        }
    };

    const handleRedirect = () => {
        setSuccessModal(false);
        router.push("/gamer/");
    };

    return (

        <div className="flex justify-center items-center min-h-screen bg-gray-100">

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="w-[400px] shadow-xl rounded-2xl">
                    <CardContent className="p-6">
                        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
                            <Link href="/" className= "w-8 h-8 text-blue-500 hover:text-purple-500 transition duration-300" title="홈으로">
                                <House />
                            </Link>
                            새 게이머 등록</h2>
                        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                            <FormField
                                label={fieldLabels.name}
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                icon={fieldIcons.name}
                            />
                            <DuplicateCheckField
                                label={fieldLabels.email}
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                icon={fieldIcons.email}
                                onCheck={handleCheckEmail}
                                message={emailMessage}
                            />
                            <DuplicateCheckField
                                label={fieldLabels.nickname}
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleChange}
                                icon={fieldIcons.nickname}
                                onCheck={handleCheckNickname}
                                message={nicknameMessage}
                            />
                            <FormField
                                label={fieldLabels.age}
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                icon={fieldIcons.age}
                            />
                            {/* 비밀번호1 */}
                            <FormField
                                label={fieldLabels.password1}
                                type="password"
                                name="password1"
                                value={formData.password1}
                                onChange={handleChange}
                                icon={fieldIcons.password1}
                                error={password1Error} // <-- 추가
                            />

                            {/* 비밀번호2 */}
                            <FormField
                                label={fieldLabels.password2}
                                type="password"
                                name="password2"
                                value={formData.password2}
                                onChange={handleChange}
                                icon={fieldIcons.password2}
                                error={password2Error} // <-- 추가
                            />

                            <FormField
                                label={fieldLabels.phone}
                                name="phone"
                                value={formData.phone}
                                onChange={handlePhoneChange} // 자동 하이픈 적용
                                icon={fieldIcons.phone}
                            />
                            <AddressField
                                address={address}
                                detailAddress={detailAddress}
                                onAddressSelect={handleAddressSelect}
                                onDetailChange={handleDetailAddressChange}
                            />
                            <Button className="w-full mt-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90">
                                등록하기
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
            <ModalDialog
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                title="입력 오류"
                message={errorMessage}
                onConfirm={() => setIsModalOpen(false)}
            />
            <ModalDialog
                open={successModal}
                onOpenChange={setSuccessModal}
                title="회원가입 완료"
                message="새 게이머가 등록되었습니다."
                onConfirm={handleRedirect}
            />
        </div>
    );
};

export default GamerForm;
