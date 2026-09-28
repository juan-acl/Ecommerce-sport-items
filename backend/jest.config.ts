import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  testMatch: ["**/*.test.ts", "**/*.spec.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@modules/(.*)$": "<rootDir>/src/modules/$1",
    "^@shared/(.*)$": "<rootDir>/src/shared/$1",
  },
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.test.ts",
    "!src/**/*.spec.ts",
    "!src/handlers/**",
  ],
  coverageDirectory: "coverage",
};

export default config;
