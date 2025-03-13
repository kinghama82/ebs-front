"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getNewsList } from "@/api/news/newsAPI";

const NewsList = () => {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getNewsList(1, 10)
            .then((data) => {
                setNewsList(data?.dtoList || []);  // ✅ 데이터 방어 처리
            })
            .catch((error) => {
                console.error(error);
                setError("뉴스 목록을 불러오는 중 오류가 발생했습니다.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">뉴스 목록</h1>

            <Link href="/news/create" className="bg-blue-500 text-white p-2 rounded">
                ✏️ 새 뉴스 작성
            </Link>

            {loading ? (
                <p className="mt-4">⏳ 뉴스 목록을 불러오는 중...</p>
            ) : error ? (
                <p className="mt-4 text-red-500">{error}</p>
            ) : (
                <ul className="mt-4">
                    {newsList.length > 0 ? (
                        newsList.map((news) => (
                            <li key={news.id} className="border-b p-2">
                                <Link href={`/news/${news.id}`}>
                                    <h2 className="text-lg font-semibold">{news.title}</h2>
                                    <p className="text-gray-500">{news.createdate}</p>
                                </Link>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500 mt-4">📭 등록된 뉴스가 없습니다.</p>
                    )}
                </ul>
            )}
        </div>
    );
};

export default NewsList;
