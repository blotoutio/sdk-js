import api from './common/api'
;(function () {
  const handleFunction = (arg: unknown) => {
    const sliced = [].slice.call(arg)
    if (!Array.isArray(sliced)) {
      return
    }

    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return library[sliced[0]](...sliced.slice(1))
    } catch (e) {
      console.error(e)
    }
  }

  const library = api
  let stubs = []
  if (window.trends) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    stubs = window.trends.stubs || []
  }

  // this needs to be regular function for arguments to work
  window.trends = function () {
    // eslint-disable-next-line prefer-rest-params
    return handleFunction(arguments)
  }

  // restore calls that were triggered before lib was ready
  stubs.forEach(handleFunction)
})()
