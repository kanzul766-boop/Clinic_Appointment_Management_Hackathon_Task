import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const configuredBackend = env.VITE_BACKEND_URL || process.env.VITE_BACKEND_URL;
  const backend = configuredBackend || "http://localhost:9000";
  if (mode === "production") {
    if (!configuredBackend) {
      throw new Error("VITE_BACKEND_URL must be set to the deployed backend origin for production builds.");
    }

    let backendUrl;
    try {
      backendUrl = new URL(configuredBackend);
    } catch {
      throw new Error("VITE_BACKEND_URL must be a valid HTTPS backend origin.");
    }
    if (
      backendUrl.protocol !== "https:" ||
      backendUrl.pathname !== "/" ||
      backendUrl.search ||
      backendUrl.hash
    ) {
      throw new Error("VITE_BACKEND_URL must be an HTTPS origin without a path, query, or fragment.");
    }
  }

  return {
  plugins: [react()],
  server: {
    proxy: {
      "/auth": backend,
      "/doctor": backend,
      "/api": backend,
      "/doctors": backend,
      "/appointments": backend,
      "/admin": backend,
      "/notifications": backend,
      "/post": backend,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("recharts") || id.includes("d3-")) return "charts";
          if (id.includes("gsap")) return "motion";
          if (id.includes("lucide-react")) return "icons";
          if (id.includes("react-dom") || id.includes("/react/") || id.includes("scheduler")) return "react-vendor";
          return undefined;
        },
      },
    },
  },
  };
});
