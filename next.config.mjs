/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "utfs.io",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com/"
            }
        ]
    },
}

export default nextConfig;
