import tailwindcss from "@tailwindcss/vite"
import path from "node:path"
import { defineConfig } from "wxt"

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-react"],
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
  manifest: {
    name: "Easy Website Blocker",
    description: "Block websites with custom path exceptions",
    version: "1.0.0",
    permissions: ["storage", "declarativeNetRequest", "webNavigation", "tabs"],
    host_permissions: ["<all_urls>"],
    action: {
      default_title: "Easy Website Blocker",
    },
    icons: {
      "16": "icon/16.png",
      "32": "icon/32.png",
      "48": "icon/48.png",
      "96": "icon/96.png",
      "128": "icon/128.png",
    },
    web_accessible_resources: [
      {
        resources: ["blocked.html"],
        matches: ["<all_urls>"],
      },
    ],
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
})
