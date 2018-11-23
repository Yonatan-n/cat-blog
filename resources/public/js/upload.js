console.log('upload js')
function clearForm () {
  document.querySelector('form').reset()
}
function gotImgHere (event) {
  const pic = event.target.files[0]
  const reader = new FileReader()
  console.log(event)
  let parent = event.target.parentElement
  let picElem = document.createElement('div')
  picElem.classList.add('jumbotron')
  /* picElem.style.maxWidth = '100%'
  picElem.style.maxHeight = '100%' */
  reader.onload = function (event2) {
    picElem.innerHTML = `
      <img src='${event2.target.result}' class='center' style="max-width: 100%; max-height: 100%;">`
    if (parent.childElementCount === 1) {
      parent.appendChild(picElem)
    } else {
      parent.children[1].children[0].src = event2.target.result
    }
    // event.target.parentElement.appendChild(picElem)
    // console.log(event.target)

    // ls.appendChild(picElem)
    // console.log(event2.target.result, 'inner thing here!!!')
  }
  reader.readAsDataURL(pic)
}
