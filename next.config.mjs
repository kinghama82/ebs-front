/** @type {import('next').NextConfig} */


const nextConfig = {
    async rewrites() {
        return [
          
        ];
      },
    
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "8080",
                pathname: "/uploads/**",
            },
        ],
    },
  }


export default nextConfig;
