/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https", // HTTPS 사용
                hostname: "boardparadice.com", // 도메인 사용
                pathname: "/uploads/**", // 업로드 경로
            },
        ],
        domains: ["boardparadice.com"],
    },
};

export default nextConfig;


/*
// 로컬환경에서 테스트시 아래코드를 사용
/!** @type {import('next').NextConfig} *!/

const nextConfig = {
    async rewrites() {
        return [];
    },
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "8080",
                pathname: "/uploads/!**",
            },
            {
                protocol: "http",
                hostname: "43.202.30.85",
                port: "8080",
                pathname: "/uploads/!**",
            },
        ],
        domains: ['43.202.30.85'],
    },
};

export default nextConfig;
*/
