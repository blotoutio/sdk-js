import {
  serveUrl,
  compareBasic,
  compareMeta,
  validateRequest,
} from '../fixtures/common'

context('Events', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    cy.clock(1614677171392)
    cy.intercept('sdk/v1/manifest/*').as('pull')
    cy.intercept('sdk/v1/events/*').as('publish')
    cy.visit(serveUrl)

    cy.wait('@pull').its('response.statusCode').should('eq', 200)
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

  it('Log event', () => {
    cy.get('#send').click()
    validateRequest(71, {
      evn: 'codified-event',
      evcs: 23636,
      scrn: 'http://localhost:9000/',
      evt: 1614677171392,
      type: 'codified',
      screen: {
        width: 1000,
        height: 1500,
        docHeight: 1500,
        docWidth: 1000,
      },
      additionalData: { lang: 'en' },
    })
  })

  it('PII event', () => {
    cy.get('#personal').click()
    cy.get('#send').click()
    cy.wait('@publish').then((interceptions) => {
      compareBasic(interceptions.response.statusCode, interceptions.request.url)
      compareMeta(interceptions.request.body.meta)

      expect(interceptions.request.body.events).to.have.lengthOf(1)
      const event = interceptions.request.body.events[0]

      expect(event.mid).to.have.lengthOf(71)
      delete event.mid

      expect(event.userid).to.have.lengthOf(87)
      delete event.userid

      expect(event.session_id).to.have.lengthOf(13)
      delete event.session_id

      expect(event.additionalData.data).to.have.lengthOf(24)
      expect(event.additionalData.key).to.have.lengthOf(172)
      expect(event.additionalData.iv).to.have.lengthOf(32)
      delete event.additionalData.data
      delete event.additionalData.key
      delete event.additionalData.iv

      assert.deepEqual(event, {
        evn: 'personal-event',
        evcs: 24050,
        scrn: 'http://localhost:9000/',
        evt: 1614677171392,
        type: 'pii',
        screen: {
          width: 1000,
          height: 1500,
          docHeight: 1500,
          docWidth: 1000,
        },
        additionalData: {},
      })
    })
  })

  it('PHI event', () => {
    cy.get('#personal').click()
    cy.get('label[for="phi"]').click()
    cy.get('#send').click()
    cy.wait('@publish').then((interceptions) => {
      compareBasic(interceptions.response.statusCode, interceptions.request.url)
      compareMeta(interceptions.request.body.meta)

      expect(interceptions.request.body.events).to.have.lengthOf(1)
      const event = interceptions.request.body.events[0]

      expect(event.mid).to.have.lengthOf(71)
      delete event.mid

      expect(event.userid).to.have.lengthOf(87)
      delete event.userid

      expect(event.session_id).to.have.lengthOf(13)
      delete event.session_id

      expect(event.additionalData.data).to.have.lengthOf(24)
      expect(event.additionalData.key).to.have.lengthOf(172)
      expect(event.additionalData.iv).to.have.lengthOf(32)
      delete event.additionalData.data
      delete event.additionalData.key
      delete event.additionalData.iv

      assert.deepEqual(event, {
        evn: 'personal-event',
        evcs: 24050,
        scrn: 'http://localhost:9000/',
        evt: 1614677171392,
        type: 'phi',
        screen: {
          width: 1000,
          height: 1500,
          docHeight: 1500,
          docWidth: 1000,
        },
        additionalData: {},
      })
    })
  })

  it('Page View event', () => {
    cy.get('#page-view').click()
    cy.get('#send').click()
    cy.wait('@publish').then((interceptions) => {
      compareBasic(interceptions.response.statusCode, interceptions.request.url)
      compareMeta(interceptions.request.body.meta)

      expect(interceptions.request.body.events).to.have.lengthOf(2)

      // Visibility hidden
      let event = interceptions.request.body.events[0]

      expect(event.mid).to.have.lengthOf(75)
      delete event.mid

      expect(event.userid).to.have.lengthOf(87)
      delete event.userid

      expect(event.session_id).to.have.lengthOf(13)
      delete event.session_id

      assert.deepEqual(event, {
        evn: 'visibility_hidden',
        evcs: 11132,
        scrn: 'https://jsdemo.blotout.io/new_page.html',
        evt: 1614677171392,
        type: 'system',
        screen: {
          width: 1000,
          height: 1500,
          docHeight: 1500,
          docWidth: 1000,
        },
        additionalData: {
          lang: 'es',
        },
      })

      // SDK start
      event = interceptions.request.body.events[1]

      expect(event.mid).to.have.lengthOf(63)
      delete event.mid
      expect(event.userid).to.have.lengthOf(87)
      delete event.userid
      expect(event.session_id).to.have.lengthOf(13)
      delete event.session_id

      assert.deepEqual(event, {
        evn: 'sdk_start',
        evcs: 11130,
        scrn: 'http://localhost:9000/',
        evt: 1614677171392,
        type: 'system',
        screen: {
          width: 1000,
          height: 1500,
          docHeight: 1500,
          docWidth: 1000,
        },
        additionalData: {
          lang: 'es',
        },
      })
    })
  })

  it('Enable / Disable', () => {
    let currentPublish = ''
    cy.get('@publish').then((interceptor) => {
      currentPublish = interceptor.id
    })
    // Disabled
    cy.get('#enable').click()
    cy.get('#enable-false').click()
    cy.get('#event').click()
    cy.get('#send').click()
    cy.wait(1000)
    cy.get('@publish').then((interceptor) => {
      expect(interceptor.id).to.eq(currentPublish)
    })

    // Enabled
    cy.get('#enable').click()
    cy.get('#enable-true').click()
    cy.get('#event').click()
    cy.get('#send').click()
    cy.wait('@publish').its('response.statusCode').should('eq', 200)
  })

  it('Default event data', () => {
    // save for all events
    cy.get('#default-event-data').click()
    cy.get('#save').click()

    const selectAllKeys = Cypress.platform === 'darwin' ? '{cmd}a' : '{ctrl}a'

    // save data for codified event
    cy.get('label[for="codified"]').click()
    cy.get('textarea').type(selectAllKeys).clear()
    cy.get('textarea').type('{{} "foo": true {}}')
    cy.get('#save').click()

    // send event
    cy.get('#event').click()
    cy.get('#send').click()
    cy.wait(1000)
    cy.get('@publish').then((interceptor) => {
      const event = interceptor.request.body.events[0]
      assert.deepEqual(event.additionalData, {
        lang: 'en', // from event
        plan: 'free', // from all data
        foo: true, // from codified data
      })
    })
  })
})
