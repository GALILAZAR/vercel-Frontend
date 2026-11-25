import { defineConfig } from "vite";
// Forward live API requests to the local Express server when enabled.
export default defineConfig({server:{proxy:{"/api":"http://127.0.0.1:4000"}}});
