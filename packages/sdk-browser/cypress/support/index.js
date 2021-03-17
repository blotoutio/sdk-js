Cypress.on('window:before:load', (win) => {
  cy.spy(win.console, 'error')
  cy.spy(win.console, 'warn')
})

beforeEach(() => {
  // make sure that every test start with clean storage so that there is no leakage
  cy.window().then(() => {
    window.sessionStorage.clear()
    cy.clearCookies()
    cy.clearLocalStorage()
  })
})

afterEach(() => {
  cy.window().then((win) => {
    // we should not allow any errors/warnings while preforming tests
    expect(win.console.error).to.have.callCount(0)
    expect(win.console.warn).to.have.callCount(0)
  })
})
