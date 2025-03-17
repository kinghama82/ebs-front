import { useState } from "react";
import { changePassword } from "@/api/gamerApi";

const ChangePasswordForm = () => {
    const [email, setEmail] = useState(""); // 로그인한 사용자의 이메일로 초기화 가능
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await changePassword({ email, currentPassword, newPassword, confirmPassword });
            setMessage(res.msg);
        } catch (error) {
            setMessage(error.response?.data?.msg || "비밀번호 변경 실패");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>이메일</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
                <label>현재 비밀번호</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            </div>
            <div>
                <label>새 비밀번호</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
            <div>
                <label>새 비밀번호 확인</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <button type="submit">비밀번호 변경</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default ChangePasswordForm;
