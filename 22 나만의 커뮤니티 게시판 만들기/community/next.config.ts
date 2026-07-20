import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ixltudixwmthyjnfiszw.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // 이미지 업로드(최대 5MB)를 위해 Server Action body 한도 상향
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
