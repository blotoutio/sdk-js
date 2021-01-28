const mockTrue = { isDevMode: true }
const mockFalse = { isDevMode: false }

describe('info', () => {
  const spy = jest.spyOn(global.console, 'info')

  beforeEach(() => jest.resetModules())
  afterEach(() => {
    spy.mockRestore()
  })

  it('development', () => {
    jest.mock('./config', () => mockTrue)
    const { info } = require('./logUtil')
    info('data')
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('production', () => {
    jest.mock('./config', () => mockFalse)
    const { info } = require('./logUtil')
    info('data')
    expect(spy).toHaveBeenCalledTimes(0)
  })
})

describe('log', () => {
  const spy = jest.spyOn(global.console, 'log')

  beforeEach(() => jest.resetModules())
  afterEach(() => {
    spy.mockRestore()
  })

  it('development', () => {
    jest.mock('./config', () => mockTrue)
    const { log } = require('./logUtil')
    log('data')
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('production', () => {
    jest.mock('./config', () => mockFalse)
    const { log } = require('./logUtil')
    log('data')
    expect(spy).toHaveBeenCalledTimes(0)
  })
})

describe('error', () => {
  const spy = jest.spyOn(global.console, 'error')

  beforeEach(() => jest.resetModules())
  afterEach(() => {
    spy.mockRestore()
  })

  it('development', () => {
    jest.mock('./config', () => mockTrue)
    const { error } = require('./logUtil')
    error('data')
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('production', () => {
    jest.mock('./config', () => mockFalse)
    const { error } = require('./logUtil')
    error('data')
    expect(spy).toHaveBeenCalledTimes(0)
  })
})
