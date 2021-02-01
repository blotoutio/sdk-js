import { serveUrl } from '../fixtures/common'

context('General', () => {
  beforeEach(() => {
    cy.visit(serveUrl)
  })

  it('user id is generated', () => {
    cy.get('#get-user-id').click()
    cy.get('#eventData').then((element) => {
      const regex = /^[a-z0-9]{16}-[a-z0-9]{8}-[a-z0-9]{8}-[a-z0-9]{8}-[a-z0-9]{24}$/gm
      assert.isNotNull(regex.exec(element.text()))
    })
  })

  it('dev event do not trigger error', () => {
    cy.get('#log-event').click()
  })

  it('dev event do not trigger error', () => {
    cy.get('#log-event').click()
  })

  it('login event do not trigger error', () => {
    cy.get('#log-in').click()
  })

  it('sign up event do not trigger error', () => {
    cy.get('#sign-up').click()
  })

  it('map id event do not trigger error', () => {
    cy.get('#map-id').click()
  })

  it('pii event do not trigger error', () => {
    cy.get('#pii').click()
  })

  it('phi event do not trigger error', () => {
    cy.get('#phi').click()
  })
})
