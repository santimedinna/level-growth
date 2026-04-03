import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compresión HTTP (gzip/brotli) en el servidor
  compress: true,

  // Eliminar el header X-Powered-By
  poweredByHeader: false,

  // React Strict Mode para detectar problemas en desarrollo
  reactStrictMode: true,

  // Optimización de imágenes: formatos modernos
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
