trends('init', {
  token: 'YJ9NSY556HG9YSK',
  endpointUrl: 'https://stage.blotout.io/sdk',
  customDomain: 'www.localhost.com',
})

const getUserId = () => {
  const id = trends('getUserId')
  document.getElementById('eventData').innerHTML = `${id}`
}
