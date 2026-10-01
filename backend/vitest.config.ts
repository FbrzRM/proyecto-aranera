import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const sharedSrc = fileURLToPath(new URL("../shared/src/index.ts", import.meta.url));

export default defineConfig({
  resolve: {
    dedupe: ["zod"],
    alias: { "@araneda/shared": sharedSrc }
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "test/**/*.test.ts"]
  }
});
