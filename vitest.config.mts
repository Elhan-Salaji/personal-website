import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    // Fremde Zeitzone, damit Tests auffallen, die versehentlich die Serverzeit nutzen
    env: { TZ: "America/New_York" },
    include: ["src/**/*.test.ts"],
  },
});
