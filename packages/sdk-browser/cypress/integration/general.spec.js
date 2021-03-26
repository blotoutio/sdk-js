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

  it('map id event do not trigger error', () => {
    cy.get('#map-id').click()
    cy.get('#send').click()
  })

  it('user id is generated', () => {
    cy.get('#user-id').click()
    cy.get('.events-content').then((element) => {
      const regex = /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}-[0-9]{13}-[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/gm
      assert.isNotNull(regex.exec(element.text()))
    })
  })
})
