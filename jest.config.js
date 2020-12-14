process.env.TZ = 'UTC'

module.exports = {
  verbose: true,
  clearMocks: true,
  resetMocks: true,
  resetModules: true,
  testMatch: [
    '<rootDir>/src/**/**/?(*\.)(test).js'
  ],
  collectCoverage: true
}
