const cookie = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)cat\s*\=\s*([^;]*).*$)|^.*$/, '$1'))
const myColors = cookie.color
const myTags = cookie.tags

let colorList = document.getElementsByName('catColor') // html node list
let tagList = document.getElementsByName('catTag') // html node list

function clearForm () {
  document.querySelector('form').reset()
}
function checkValidBoxes (listOf, validOf) {
  // this function get 2 args, html list of nodes, and a list of tags/colors
  // even if there is only one color, it will be ["color"].
  // no colors are checked by and if statment later when used
  listOf.forEach(x => {
    if (validOf.indexOf(x.value) !== -1) {
      x.checked = true
    }
  })
}

document.getElementsByName('catName')[0].value = cookie.name // change name to cat name
document.getElementsByName('catDesc')[0].value = cookie.description // change desc to cat desc
document.getElementsByName('catId')[0].value = cookie.id
if (myColors) { // check the cat colors boxes
  checkValidBoxes(colorList, myColors)
}
if (myTags) { // check the cat tags boxes
  checkValidBoxes(tagList, myTags)
}
