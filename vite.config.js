import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about.html"),
        account: resolve(__dirname, "account.html"),
        checkout: resolve(__dirname, "checkout.html"),
        contact: resolve(__dirname, "contact.html"),
        faq: resolve(__dirname, "faq.html"),
        pricing: resolve(__dirname, "pricing.html"),
        privacy: resolve(__dirname, "privacy.html"),
        results: resolve(__dirname, "results.html"),
        terms: resolve(__dirname, "terms.html"),
        "404": resolve(__dirname, "404.html"),
      },
    },
    // Enable minification (default is esbuild for JS, lightningcss or esbuild for CSS)
    minify: "esbuild",
    cssMinify: true,
    // Output to dist/
    outDir: "dist",
    // Clean output directory on build
    emptyOutDir: true,
  },
});
