import { serveUrl } from '../fixtures/common'

context('General', () => {
  beforeEach(() => {
    cy.visit(serveUrl)
  })

  it('event do not trigger error', () => {
    cy.get('#send').click()
  })

  it('pii event do not trigger error', () => {
    cy.get('#personal').click()
    cy.get('#send').click()
  })

  it('phi event do not trigger error', () => {
    cy.get('#personal').click()
    cy.get('label[for="phi"]').click()
    cy.get('#send').click()
  })

  it('page-view event do not trigger error', () => {
    cy.get('#page-view').click()
    cy.get('#send').click()
  })

  it('defined event do not trigger error', () => {
    cy.get('#defined-events').click()
    cy.get('#send').click()
  })

  it('user id is generated', () => {
    cy.get('#user-id').click()
    cy.get('.events-content').then((element) => {
      const regex =
        /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}-[0-9]{13}-[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/gm
      assert.isNotNull(regex.exec(element.text()))
    })
  })

  it('enable do not trigger error', () => {
    cy.get('#enable').click()
    cy.get('#enable-true').click()
    cy.get('#enable-false').click()
  })

  it('default event data do not trigger error', () => {
    cy.get('#default-event-data').click()
    cy.get('#save').click()
  })
})
