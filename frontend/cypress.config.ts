import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://www.trashai.org/",
    pageLoadTimeout: 3000
  },
});
