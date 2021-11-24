import { info, log, error, setLogging } from './logUtil'

describe('info', () => {
  const spy = jest.spyOn(global.console, 'info')

  beforeEach(() => jest.resetModules())

  afterEach(() => {
    spy.mockReset()
  })

  afterAll(() => {
    spy.mockRestore()
  })

  it('logging off', async () => {
    setLogging(false)
    info('data')
    expect(spy).toHaveBeenCalledTimes(0)
  })

  it('logging on', async () => {
    setLogging(true)
    info('data')
    expect(spy).toHaveBeenCalledTimes(1)
  })
})

describe('log', () => {
  const spy = jest.spyOn(global.console, 'log')

  beforeEach(() => jest.resetModules())

  afterEach(() => {
    spy.mockReset()
  })

  afterAll(() => {
    spy.mockRestore()
  })

  it('logging off', async () => {
    setLogging(false)
    log('data')
    expect(spy).toHaveBeenCalledTimes(0)
  })

  it('logging on', async () => {
    setLogging(true)
    log('data')
    expect(spy).toHaveBeenCalledTimes(1)
  })
})

describe('error', () => {
  const spy = jest.spyOn(global.console, 'error')

  beforeEach(() => jest.resetModules())

  afterEach(() => {
    spy.mockReset()
  })

  afterAll(() => {
    spy.mockRestore()
  })

  it('logging off', async () => {
    setLogging(false)
    error('data')
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('logging on', async () => {
    setLogging(true)
    error('data')
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
