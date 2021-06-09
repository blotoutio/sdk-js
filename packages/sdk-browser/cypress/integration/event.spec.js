import { serveUrl } from '../fixtures/common'

const compareMeta = (meta) => {
  expect(meta).to.have.ownProperty('sdkv')
  expect(meta.sdkv).to.have.lengthOf(5)
  delete meta.sdkv

  expect(meta).to.have.ownProperty('appv')
  delete meta.appv

  expect(meta).to.have.ownProperty('osv')
  delete meta.osv

  expect(meta).to.have.ownProperty('dmft')
  delete meta.dmft

  expect(meta).to.have.ownProperty('dm')
  delete meta.dm

  expect(meta).to.have.ownProperty('osn')
  delete meta.osn

  expect(meta).to.have.ownProperty('bnme')
  delete meta.bnme

  expect(meta).to.have.ownProperty('plf')
  delete meta.plf

  const expected = {
    tz_offset: -480,
    user_id_created: 1614677171392,
    page_title: 'Blotout - JS SDK',
  }
  assert.deepEqual(meta, expected)
}
const compareBasic = (statusCode, url) => {
  assert.equal(
    url,
    'https://stage.blotout.io/sdk/v1/events/publish?token=JX2GN9XYDTSWG6U'
  )
  assert.equal(statusCode, 200)
}

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

      assert.deepEqual(event, {
        evn: 'codified-event',
        evcs: 23636,
        scrn: 'http://localhost:9000/',
        evt: 1614677171392,
        type: 'codified',
        screen: {
          width: 1000,
          height: 700,
          docHeight: 700,
          docWidth: 1000,
        },
        additionalData: { lang: 'en' },
      })
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
          height: 700,
          docHeight: 700,
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
          height: 700,
          docHeight: 700,
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
          height: 700,
          docHeight: 700,
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
          height: 700,
          docHeight: 700,
          docWidth: 1000,
        },
        additionalData: {
          lang: 'es',
        },
      })
    })
  })

  it('Map ID event', () => {
    cy.get('#map-id').click()
    cy.get('#send').click()
    cy.wait('@publish').then((interceptions) => {
      compareBasic(interceptions.response.statusCode, interceptions.request.url)
      compareMeta(interceptions.request.body.meta)

      expect(interceptions.request.body.events).to.have.lengthOf(1)
      const event = interceptions.request.body.events[0]

      expect(event.mid).to.have.lengthOf(59)
      delete event.mid

      expect(event.userid).to.have.lengthOf(87)
      delete event.userid

      expect(event.session_id).to.have.lengthOf(13)
      delete event.session_id

      assert.deepEqual(event, {
        evn: 'map_id',
        evcs: 21001,
        scrn: 'http://localhost:9000/',
        evt: 1614677171392,
        type: 'codified',
        screen: {
          width: 1000,
          height: 700,
          docHeight: 700,
          docWidth: 1000,
        },
        additionalData: {
          lang: 'de',
          map_id: '234234234',
          map_provider: 'sass',
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
