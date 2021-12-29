export const serveUrl = 'http://localhost:9000'

export const compareMeta = (meta) => {
  expect(meta).to.have.ownProperty('sdkv')
  expect(meta.sdkv).to.have.lengthOf(6)
  delete meta.sdkv

  const expected = {
    tz_offset: -480,
    page_title: 'Blotout - JS SDK',
    user_agent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36',
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

    expect(event.session_id).to.have.lengthOf(13)
    delete event.session_id

    assert.deepEqual(event, expectedPayload)
  })
}
