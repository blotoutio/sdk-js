process.env.TZ = 'UTC'

module.exports = {
  verbose: true,
  clearMocks: true,
  resetMocks: true,
  resetModules: true,
  testMatch: ['**/?(*.)+(test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  collectCoverage: true,
  moduleNameMapper: {
    '@blotoutio/sdk-core': '<rootDir>/../sdk-core/dist',
  },
}
