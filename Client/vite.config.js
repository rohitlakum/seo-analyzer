import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      }, 
      "/demo": {
        target: "https://jsonplaceholder.typicode.com/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/demo/, ""),
      },
      
    },
  },
});
