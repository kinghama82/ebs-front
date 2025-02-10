/** @type {import('next').NextConfig} */
<<<<<<< HEAD
import 'dotenv/config';

const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: 'https://www.koreaexim.go.kr/:path*', // 프록시할 외부 API URL
          },
        ];
      },
    env: {
        NEXT_PUBLIC_EXIM_API_KEY: process.env.NEXT_PUBLIC_EXIM_API_KEY,
=======
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "8080",
                pathname: "/uploads/**",
            },
        ],
>>>>>>> 98ebf81c00470af5946bee1fef49db38626ab0d5
    },
};

export default nextConfig;
