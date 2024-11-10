import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			"/api": "http://localhost:5000",
		},
		host: "0.0.0.0",
	},
	resolve: {
		alias: {
			"@": path.join(__dirname, "./src"),
		},
	},
});
