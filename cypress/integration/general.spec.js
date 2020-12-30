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
})
