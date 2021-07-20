const getChildPosition = function (element) {
  const parent = element.parentNode
  for (let i = 0; i < parent.children.length; i++) {
    if (parent.children[i] === element) {
      return i
    }
  }

  throw new Error('No parent found')
}

window.addEventListener('load', function () {
  document.querySelectorAll('ul.tab li a').forEach(function (link) {
    link.addEventListener(
      'click',
      function (event) {
        event.preventDefault()

        const liTab = link.parentNode
        const ulTab = liTab.parentNode
        const position = getChildPosition(liTab)
        if (liTab.className.includes('active')) {
          return
        }

        const tabContentId = ulTab.getAttribute('data-name')
        document
          .querySelectorAll(`[data-name="${tabContentId}"] li`)
          .forEach((li) => {
            li.classList.remove('active')
          })

        document
          .querySelectorAll(`[data-name="${tabContentId}"]`)
          .forEach((ul) => {
            ul.querySelectorAll('li')[position].classList.add('active')
          })
      },
      false
    )
  })
})
