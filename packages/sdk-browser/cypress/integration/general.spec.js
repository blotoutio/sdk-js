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
    const id = 'k4j12i4j12i4p123j4ij23'
    cy.setCookie('_trends_user_id', id)
    cy.setCookie('username', 'John Doe')
    cy.get('#user-id').click()
    cy.get('.events-content').then((element) => {
      assert.equal(id, element.text())
    })
  })

  it('enable do not trigger error', () => {
    cy.get('#settings').click()
    cy.get('#enable-true').click()
    cy.get('#enable-false').click()
  })

  it('logging do not trigger error', () => {
    cy.get('#settings').click()
    cy.get('#logging-true').click()
    cy.get('#logging-false').click()
  })

  it('default event data do not trigger error', () => {
    cy.get('#default-event-data').click()
    cy.get('#save').click()
  })
})
