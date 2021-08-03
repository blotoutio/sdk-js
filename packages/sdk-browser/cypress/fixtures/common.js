export const serveUrl = 'http://localhost:9000'

export const compareMeta = (meta) => {
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

export const compareBasic = (statusCode, url) => {
  assert.equal(
    url,
    'https://sandbox.blotout.io/sdk/v1/events/publish?token=A7VHMB4XT6YTU4Z'
  )
  assert.equal(statusCode, 200)
}

export const validateRequest = (midLength, expectedPayload) => {
  cy.wait('@publish').then((interceptions) => {
    compareBasic(interceptions.response.statusCode, interceptions.request.url)
    compareMeta(interceptions.request.body.meta)

    expect(interceptions.request.body.events).to.have.lengthOf(1)
    const event = interceptions.request.body.events[0]

    expect(event.mid).to.have.lengthOf(midLength)
    delete event.mid

    expect(event.userid).to.have.lengthOf(87)
    delete event.userid

    expect(event.session_id).to.have.lengthOf(13)
    delete event.session_id

    assert.deepEqual(event, expectedPayload)
  })
}
