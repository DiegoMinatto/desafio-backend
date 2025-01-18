module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'json', 'ts'],
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    testMatch: ['**/*.spec.ts'], // Ajuste conforme necessário
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
  };