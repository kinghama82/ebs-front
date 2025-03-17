"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { getNewsById, deleteNews } from "@/api/news/newsAPI";

const NewsDetail = () => {
    const { id } = useParams();
    const router = useRouter();
    const [news, setNews] = useState(null);

    useEffect(() => {
        getNewsById(id)
            .then((data) => setNews(data))
            .catch((error) => console.error(error));
    }, [id]);

    const handleDelete = async () => {
        try {
            await deleteNews(id);
            router.push("/news");
        } catch (error) {
            console.error("삭제 실패", error);
        }
    };

    if (!news) return <p>로딩 중...</p>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold">{news.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: news.content }} className="border p-2 rounded" />

            {news.imageUrls && news.imageUrls.map((img, idx) => (
                <img key={idx} src={`http://localhost:8080${img}`} alt="news image" className="my-4" />

            ))}

            {news.youtubeUrl && (
                <iframe width="560" height="315" src={news.youtubeUrl} frameBorder="0" allowFullScreen></iframe>
            )}

            <button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded">
                ❌ 삭제
            </button>
        </div>
    );
};

export default NewsDetail;
