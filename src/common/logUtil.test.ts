const mockTrue = { isDevMode: true }
const mockFalse = { isDevMode: false }

describe('info', () => {
  const spy = jest.spyOn(global.console, 'info')

  beforeEach(() => jest.resetModules())
  afterEach(() => {
    spy.mockRestore()
  })

  it('development', async () => {
    jest.mock('./config', () => mockTrue)
    const { info } = await import('./logUtil')
    info('data')
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('production', async () => {
    jest.mock('./config', () => mockFalse)
    const { info } = await import('./logUtil')
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

  it('development', async () => {
    jest.mock('./config', () => mockTrue)
    const { log } = await import('./logUtil')
    log('data')
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('production', async () => {
    jest.mock('./config', () => mockFalse)
    const { log } = await import('./logUtil')
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

  it('development', async () => {
    jest.mock('./config', () => mockTrue)
    const { error } = await import('./logUtil')
    error('data')
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('production', async () => {
    jest.mock('./config', () => mockFalse)
    const { error } = await import('./logUtil')
    error('data')
    expect(spy).toHaveBeenCalledTimes(0)
  })
})
