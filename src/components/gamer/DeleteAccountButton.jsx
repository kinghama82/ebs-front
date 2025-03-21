import { deleteGamer } from "@/api/gamerApi";
import { useState } from "react";

const DeleteAccountButton = ({ userEmail }) => {

    const handleDelete = async () => {
        // 탈퇴 전 확인 창
        if (!window.confirm("정말로 회원탈퇴 하시겠습니까? 이 작업은 복구할 수 없습니다.")) {
            return;
        }

        try {
            // 회원탈퇴 API 호출 (이메일만 전송)
            const result = await deleteGamer(userEmail);
            console.log(result.msg);

            // 탈퇴 성공 후, 로컬 스토리지 및 기타 상태 정리 후 로그인 페이지로 이동
            localStorage.removeItem("userEmail");
            window.location.href = "/login";
        } catch (error) {
            alert("회원탈퇴에 실패하였습니다: " + (error.response?.data?.msg || error.message));
        }
    };

    return (
        <div>
            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">
                회원탈퇴
            </button>
        </div>
    );
};

export default DeleteAccountButton;
