import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    // remote for images
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "i.pinimg.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "as2.ftcdn.net",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "cdn-icons-png.flaticon.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "cdn.midjourney.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: "10mb", // Default is 1mb
        },
    },
};

export default nextConfig;
