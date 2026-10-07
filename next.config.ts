import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native SQLite driver must stay out of the bundle.
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
