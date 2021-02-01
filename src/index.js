import api from './common/api'
;(function () {
  const handleFunction = (arg) => {
    const sliced = [].slice.call(arg)
    if (!Array.isArray(sliced) || sliced.length === 0) {
      return
    }

    try {
      return library[sliced[0]](...sliced.slice(1))
    } catch (e) {
      console.error(e)
    }
  }

  const library = api
  let stubs = []
  if (window.trends) {
    stubs = window.trends.stubs || []
  }

  // this needs to be regular function for arguments to work
  window.trends = function () {
    return handleFunction(arguments)
  }

  // restore calls that were triggered before lib was ready
  stubs.forEach(handleFunction)
})()
