/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: 'dist',
    images: {
        unoptimized: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: false,
    },
    trailingSlash: true,
};

export default nextConfig;
