import { getDomain, setCustomDomain } from './domainUtil'

beforeEach(() => {
  setCustomDomain(null)
})

describe('setCustomDomain/getDomain', () => {
  it('ok', () => {
    setCustomDomain('page.com')
    expect(getDomain()).toMatch('page.com')
  })
})

describe('getDomain', () => {
  it('no custom domain', () => {
    expect(getDomain()).toMatch('localhost')
  })
})
