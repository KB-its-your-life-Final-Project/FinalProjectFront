import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const backendPort = env.VITE_BACKEND_PORT || "8080";
  console.log("backendPort: ", backendPort);
  return {
    plugins: [vue(), vueDevTools(), tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: `http://localhost:${backendPort}`,
        },
      },
    },
    build: {
      outDir: "../FinalProjectBack/src/main/webapp/resources",
    },
  };
});
