import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",

  setupFiles: ["<rootDir>/tests/setup.ts"],

  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.test.ts"],

  clearMocks: true,

  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json",
      },
    ],
  },
};

export default config;