import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Static export: `next build` emits plain HTML/CSS/JS into `out/`.
  // cacheComponents / partialPrefetching (PPR) are not supported in export mode.
  output: "export",
  // Export tĩnh không có server tối ưu ảnh — ảnh đã được nén sẵn bằng `npm run photos`.
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
