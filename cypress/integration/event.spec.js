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
    appn: 'www.localhost.com',
    dplatform: 'desktop',
  }
  assert.deepEqual(meta, expected)
}
const compareBasic = (statusCode, url) => {
  assert.equal(
    url,
    'https://stage.blotout.io/sdk/v1/events/publish?token=YJ9NSY556HG9YSK'
  )
  assert.equal(statusCode, 200)
}

context('Events', () => {
  beforeEach(() => {
    cy.clock(1614677171392)
    cy.intercept('sdk/v1/events/*').as('publish')
    cy.intercept('sdk/v1/manifest/*').as('pull')
    cy.visit(serveUrl)

    cy.wait('@pull').then((interceptions) => {
      assert.equal(interceptions.response.statusCode, 200)
    })

    cy.wait('@publish').then((interceptions) => {
      if (interceptions.request.body.events[0].evn === 'pagehide') {
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
    cy.get('#log-event').click()
    cy.wait('@publish').then((interceptions) => {
      compareBasic(interceptions.response.statusCode, interceptions.request.url)
      compareMeta(interceptions.request.body.meta)

      expect(interceptions.request.body.events).to.have.lengthOf(1)
      const event = interceptions.request.body.events[0]
      expect(event).to.have.ownProperty('mid')
      expect(event.mid).to.have.lengthOf(100)
      expect(event).to.have.ownProperty('userid')
      expect(event.userid).to.have.lengthOf(68)
      expect(event.properties).to.have.ownProperty('session_id')
      expect(event.properties.session_id).to.have.lengthOf(13)

      delete event.mid
      delete event.userid
      delete event.properties.session_id

      assert.deepEqual(event, {
        evn: 'Dev Click',
        evcs: 23801,
        scrn: 'http://localhost:9000/',
        evt: 1614677171392,
        properties: {
          screen: {
            width: 1000,
            height: 660,
            docHeight: 660,
            docWidth: 1000,
          },
          codifiedInfo: { data: 'foo' },
        },
      })
    })
  })

  it('Log in event', () => {
    cy.get('#log-in').click()
    cy.wait('@publish').then((interceptions) => {
      compareBasic(interceptions.response.statusCode, interceptions.request.url)
      compareMeta(interceptions.request.body.meta)

      expect(interceptions.request.body.events).to.have.lengthOf(1)

      const event = interceptions.request.body.events[0]
      expect(event).to.have.ownProperty('mid')
      expect(event.mid).to.have.lengthOf(100)
      expect(event).to.have.ownProperty('userid')
      expect(event.userid).to.have.lengthOf(68)
      expect(event.properties).to.have.ownProperty('session_id')
      expect(event.properties.session_id).to.have.lengthOf(13)

      delete event.mid
      delete event.userid
      delete event.properties.session_id

      assert.deepEqual(event, {
        evn: 'Log in',
        evcs: 23862,
        scrn: 'http://localhost:9000/',
        evt: 1614677171392,
        properties: {
          screen: {
            width: 1000,
            height: 660,
            docHeight: 660,
            docWidth: 1000,
          },
        },
      })
    })
  })

  it('Map ID event', () => {
    cy.get('#map-id').click()
    cy.wait('@publish').then((interceptions) => {
      compareBasic(interceptions.response.statusCode, interceptions.request.url)
      compareMeta(interceptions.request.body.meta)

      expect(interceptions.request.body.events).to.have.lengthOf(1)

      const event = interceptions.request.body.events[0]
      expect(event).to.have.ownProperty('mid')
      expect(event.mid).to.have.lengthOf(100)
      expect(event).to.have.ownProperty('userid')
      expect(event.userid).to.have.lengthOf(68)
      expect(event.properties).to.have.ownProperty('session_id')
      expect(event.properties.session_id).to.have.lengthOf(13)

      delete event.mid
      delete event.userid
      delete event.properties.session_id

      assert.deepEqual(event, {
        evn: 'map_id',
        evcs: 21001,
        scrn: 'http://localhost:9000/',
        evt: 1614677171392,
        properties: {
          screen: {
            width: 1000,
            height: 660,
            docHeight: 660,
            docWidth: 1000,
          },
          codifiedInfo: {
            lang: 'es',
            map_id: '234234234',
            map_provider: 'service',
          },
        },
      })
    })
  })

  it('PII event', () => {
    cy.get('#pii').click()
    cy.wait('@publish').then((interceptions) => {
      compareBasic(interceptions.response.statusCode, interceptions.request.url)
      compareMeta(interceptions.request.body.meta)

      expect(interceptions.request.body.events).to.have.lengthOf(1)

      const event = interceptions.request.body.events[0]
      expect(event).to.have.ownProperty('mid')
      expect(event.mid).to.have.lengthOf(100)
      delete event.mid

      expect(event).to.have.ownProperty('userid')
      expect(event.userid).to.have.lengthOf(68)
      delete event.userid

      expect(event.properties).to.have.ownProperty('session_id')
      expect(event.properties.session_id).to.have.lengthOf(13)
      delete event.properties.session_id

      expect(event.pii).to.have.ownProperty('data')
      expect(event.pii.data).to.have.lengthOf(600)
      expect(event.pii).to.have.ownProperty('key')
      expect(event.pii.key).to.have.lengthOf(172)
      expect(event.pii).to.have.ownProperty('iv')
      expect(event.pii.iv).to.have.lengthOf(32)
      delete event.pii

      assert.deepEqual(event, {
        evn: 'PII event',
        evcs: 24102,
        scrn: 'http://localhost:9000/',
        evt: 1614677171392,
        properties: {
          screen: {
            width: 1000,
            height: 660,
            docHeight: 660,
            docWidth: 1000,
          },
        },
      })
    })
  })

  it('PHI event', () => {
    cy.get('#phi').click()
    cy.wait('@publish').then((interceptions) => {
      compareBasic(interceptions.response.statusCode, interceptions.request.url)
      compareMeta(interceptions.request.body.meta)

      expect(interceptions.request.body.events).to.have.lengthOf(1)

      const event = interceptions.request.body.events[0]
      expect(event).to.have.ownProperty('mid')
      expect(event.mid).to.have.lengthOf(100)
      delete event.mid

      expect(event).to.have.ownProperty('userid')
      expect(event.userid).to.have.lengthOf(68)
      delete event.userid

      expect(event.properties).to.have.ownProperty('session_id')
      expect(event.properties.session_id).to.have.lengthOf(13)
      delete event.properties.session_id

      expect(event.phi).to.have.ownProperty('data')
      expect(event.phi.data).to.have.lengthOf(576)
      expect(event.phi).to.have.ownProperty('key')
      expect(event.phi.key).to.have.lengthOf(172)
      expect(event.phi).to.have.ownProperty('iv')
      expect(event.phi.iv).to.have.lengthOf(32)
      delete event.phi

      assert.deepEqual(event, {
        evn: 'PHI event',
        evcs: 23916,
        scrn: 'http://localhost:9000/',
        evt: 1614677171392,
        properties: {
          screen: {
            width: 1000,
            height: 660,
            docHeight: 660,
            docWidth: 1000,
          },
        },
      })
    })
  })
})
