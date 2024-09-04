import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import { createRequire } from "node:module";
import fs from "node:fs";

const require = createRequire(import.meta.url);

// https://vitejs.dev/config/
export default defineConfig({
  base: "/pdf-viewer-flipbook",
  plugins: [
    react(),
    {
      name: "copy-pdf-worker",
      closeBundle() {
        const pdfjsDistPath = path.dirname(
          require.resolve("pdfjs-dist/package.json")
        );
        const pdfWorkerPath = path.join(
          pdfjsDistPath,
          "build",
          "pdf.worker.mjs"
        );

        try {
          fs.cpSync(pdfWorkerPath, "./dist/assets/pdf.worker.mjs", {
            recursive: true,
          });
          console.log("PDF worker copied successfully.");
        } catch (err) {
          console.error("Error copying PDF worker:", err);
        }
      },
    },
  ],
});
