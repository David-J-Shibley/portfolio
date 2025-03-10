import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  return {
    server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'process.env.VITE_EMAIL_TEMPLATE_ID': JSON.stringify(env.VITE_EMAIL_TEMPLATE_ID),
    'process.env.VITE_EMAIL_PUBLIC_KEY': JSON.stringify(env.VITE_EMAIL_PUBLIC_KEY),
    'process.env.VITE_EMAIL_SERVICE_ID': JSON.stringify(env.VITE_EMAIL_SERVICE_ID),
}
}});