"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";


export default function DeleteButton({ id, onDelete, triggerButton, redirectTo = "" }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // 사용방법
    // 먼저 삭제할 함수를 만든다 예) 댓글삭제함수 게시글 삭제 함수
    // 예시)
    // const handleDelete = async ( id ) => {
    //     return await deleteFreeAnswer(answer.id);   <-- api에 만든 삭제 함수 넣음 그리고 삭제할 대상의 id
    //   };
    //   적당한 위치에 버튼 넣고 아래처럼 요소들 넣어줌      
    //   <DeleteButton id={comment.id}         삭제할 대상의 id
    //                 onDelete={handleDelete} 방금 위에서 만든 함수
    //                 redirectTo="/history"   삭제후 보낼 화면의 주소
    //                 triggerButton={<Button variant="destructive">삭제</Button>}
    //    />;                          내가 쓰고싶은 버튼 모양 커스텀
    //                                               

    const handleClickDelete = async () => {
        setLoading(true);
        try {
            await onDelete(id);
            toast("삭제 완료", {
                description: "데이터가 삭제되었습니다.",
            });
            if (redirectTo) {
                router.push(redirectTo);
            }
        } catch (error) {
            console.error("삭제 중 오류 발생:", error);
            toast("삭제 실패", {
                description: "오류가 발생했습니다. 다시 시도해주세요.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {triggerButton}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>기록 삭제</AlertDialogTitle>
                    <AlertDialogDescription>
                        한 번 삭제하면 돌이킬 수 없습니다!<br />
                        정말 삭제하시겠습니까?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>취소</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-500 hover:bg-red-500" 
                                       onClick={handleClickDelete} disabled={loading}>
                        {loading ? "삭제 중..." : "확인"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
