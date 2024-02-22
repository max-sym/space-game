import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"
import vitePluginString from "vite-plugin-string"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
      "~": path.resolve(__dirname, "../game/src/"),
    },
  },
  plugins: [react(), vitePluginString()],
})
