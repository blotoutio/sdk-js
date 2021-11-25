import { serveUrl, validateRequest } from '../fixtures/common'

context('Defined Events', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    cy.clock(1614677171392)
    cy.intercept('sdk/v1/events/*').as('publish')
    cy.visit(serveUrl)

    cy.wait('@publish').then((interceptions) => {
      if (interceptions.request.body.events[0].evn === 'visibility_hidden') {
        assert.equal(interceptions.response.statusCode, 200)

        cy.wait('@publish').then((interceptions) => {
          assert.equal(interceptions.request.body.events[0].evn, 'sdk_start')
        })
        return
      }
      assert.equal(interceptions.request.body.events[0].evn, 'sdk_start')
      assert.equal(interceptions.response.statusCode, 200)
    })
  })

  it('Map ID', () => {
    cy.get('#defined-events').click()
    cy.get('#event-selection').select('mapID')
    cy.get('#send').click()

    validateRequest(59, {
      evn: 'map_id',
      scrn: 'http://localhost:9000/',
      evt: 1614677171392,
      type: 'codified',
      screen: {
        width: 1000,
        height: 1500,
        docHeight: 1500,
        docWidth: 1000,
      },
      additionalData: {
        lang: 'de',
        map_id: '234234234',
        map_provider: 'sass',
      },
    })
  })

  it('Transaction', () => {
    cy.get('#defined-events').click()
    cy.get('#event-selection').select('transaction')
    cy.get('#send').click()

    validateRequest(67, {
      evn: 'transaction',
      scrn: 'http://localhost:9000/',
      evt: 1614677171392,
      type: 'codified',
      screen: {
        width: 1000,
        height: 1500,
        docHeight: 1500,
        docWidth: 1000,
      },
      additionalData: {
        lang: 'de',
        transaction_currency: 'EUR',
        transaction_discount: 2,
        transaction_id: '123123',
        transaction_payment: 'credit-card',
        transaction_shipping: 5,
        transaction_tax: 3.2,
        transaction_total: 20.4,
      },
    })
  })

  it('Item', () => {
    cy.get('#defined-events').click()
    cy.get('#event-selection').select('item')
    cy.get('#send').click()

    validateRequest(59, {
      evn: 'item',
      scrn: 'http://localhost:9000/',
      evt: 1614677171392,
      type: 'codified',
      screen: {
        width: 1000,
        height: 1500,
        docHeight: 1500,
        docWidth: 1000,
      },
      additionalData: {
        lang: 'de',
        item_category: ['cars', 'electric'],
        item_currency: 'EUR',
        item_id: '123123',
        item_name: 'EV',
        item_price: 20.4,
        item_quantity: 2,
      },
    })
  })

  it('Persona', () => {
    cy.get('#defined-events').click()
    cy.get('#event-selection').select('persona')
    cy.get('#send').click()

    validateRequest(63, {
      evn: 'persona',
      scrn: 'http://localhost:9000/',
      evt: 1614677171392,
      type: 'codified',
      screen: {
        width: 1000,
        height: 1500,
        docHeight: 1500,
        docWidth: 1000,
      },
      additionalData: {
        lang: 'de',
        persona_address: 'Street 1',
        persona_age: 22,
        persona_city: 'Some City',
        persona_country: 'US',
        persona_dob: '4/30/2000',
        persona_email: 'j@domain.com',
        persona_firstname: 'John',
        persona_lastname: 'Smith',
        persona_middlename: 'Jack',
        persona_number: '+386 31 777 444',
        persona_state: 'CA',
        persona_username: 'jsmith',
        persona_zip: 10000,
        persona_id: '312312',
        persona_gender: 'female',
      },
    })
  })
})
