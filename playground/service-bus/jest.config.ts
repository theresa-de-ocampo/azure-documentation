import type { Config } from "jest";

export default async (): Promise<Config> => {
  return {
    preset: "ts-jest/presets/default-esm",
    // setupFiles: ["./jest.setup.ts"],
    testMatch: ["**/__tests__/**/*.test.ts"],
    collectCoverage: true,
    collectCoverageFrom: ["src/**/*.ts"],
    coverageDirectory: "./__tests__/__report__/coverage",
    coverageReporters: ["text", "lcov", "cobertura"],
    coverageThreshold: {
      global: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: -2
      }
    },
    reporters: [
      "default",
      [
        "jest-junit",
        { outputDirectory: "__tests__/__report__", outputName: "summary.xml" }
      ]
    ],
    testTimeout: 15_000
  };
};
