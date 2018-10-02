// Global Vars are:
// window.catNumber // number
// window.fetchedCats // array of JSON object
// window.catKind
// window.state
const eq = a => JSON.stringify(a)
function createCatCard (name, desc, imgPath, up_date, theId) {
  // console.log(imgPath)
  let catCard = document.createElement('div')
  catCard.className = 'catCard card'
  catCard.style.borderColor = '#f29e91'
  catCard.style.minWidth = '14em' // THIS IS THE NEW RESIEZ THING!!!!
  /* catCard.style.maxWidth = '14em'
  catCard.style.margin = '10px 10px 10px 10px' /* top | right | bottom | left */
  let cardBody = document.createElement('div')
  cardBody.className = 'card-body'
  let img = document.createElement('img')
  img.src = imgPath
  img.alt = 'cat pic'
  img.className = 'card-img-top d-block'
  let cardTitle = document.createElement('h5')
  cardTitle.className = 'card-text text-center'
  cardTitle.innerText = name
  let cardDesc = document.createElement('p')
  cardDesc.className = 'card-text'
  cardDesc.innerText = desc
  let catDate = document.createElement('p')
  catDate.className = 'card-text'
  makeFormatDate = (d) => d.slice(0, 10).split('-').reverse().join('-') // eslint-disable-line
  catDate.innerText = makeFormatDate(up_date) // eslint-disable-line
  catDate.style.fontSize = '0.7em'
  // <p class="card-text" id='catDate' style="font-size: 0.9em;">29-08-2018</p>
  // end of def
  // <div class="form-group mx-auto text-center">
  // <button type="submit" class="btn btn-secondary">Send The Form</button>
  // </div>
  let catButton = document.createElement('div')
  catButton.className = 'text-center mx-auto'
  catButton.id = 'edit-button'
  catButton.style.display = 'none'
  // catButton.style.position = 'absolute'
  // catButton.style.bottom = '0'
  let aButton = document.createElement('button')
  // aButton.style = 'cursor:pointer'
  aButton.name = 'editButton'
  aButton.className = 'btn btn-primary'
  aButton.innerText = 'Edit'
  aButton.onclick = buttonEditHandler // This is the buttons Event Handler
  aButton.style.margin = '0px 10px 0px 10px'
  let bButton = document.createElement('button')
  bButton.name = 'deleteButton'
  bButton.className = 'btn btn-danger'
  bButton.innerText = 'Delete'
  bButton.onclick = buttonDeleteHandler
  bButton.style.margin = '0px 10px 0px 10px'
  let catId = document.createElement('p')
  catId.innerText = theId
  catId.style.display = 'none'
  catButton.append(aButton, bButton)
  cardBody.append(img, cardTitle, cardDesc, catDate, catButton, catId)
  catCard.appendChild(cardBody)
  return catCard
}

function appendCatList (xs, to) {
  document.querySelector(to).append(xs)
}

function makeCatList3 (url, to) {
  const parent = document.querySelector(to)
  window.fetch(url)
    .then(a => a.json())
    .then(xs => xs.forEach(x =>
      parent.append(
        createCatCard(x.name, x.description, x.file_name, x.up_date, x.id))))
}

async function makeCatList4 (url = `${baseURL}/api/all`, to = '#catList', func = (() => true)) {
  const parent = document.querySelector(to)
  if (!window.catNumber) { window.catNumber = 0 }
  const lower = window.catNumber
  if (!window.fetchedCats) {
    await window.fetch(url)
      .then(a => a.json())
      .then(a => { window.fetchedCats = a; return a })
    /* .then(a => console.log('done')) */
  }
  await window.fetchedCats.filter(x => func(x)).slice(0 + lower, 15 + lower).forEach(x =>
    parent.append(
      createCatCard(x.name, x.description, x.file_name, x.up_date, x.id)))
}

function pageButtonHandler0 (n = 0, direction = 'next', options = []) { // make something so that this function will check the state of the page, like check the hash (#) and keep the same cats on next press
  let amount = 0
  if (direction === 'next') {
    amount = n
  } else if (direction === 'prev') {
    amount = (-n)
  } else if (direction === 'zero') {
    window.catNumber = 0
  }
  let error = document.getElementById('error')
  console.log('pageButtonHandler')
  if (!window.catKind) { window.catKind = [null, null, window.fetchedCats.length] }
  if (window.catNumber + amount < 0) {
    error.innerText = `You're at the start!`
  } else if (window.catNumber + amount > (window.catKind[2])) {
    error.innerText = `No More cats 4 now!`
  } else {
    window.catNumber += amount
    error.innerText = ''
    craftFunctionForList('#catList', window.catKind[0] === null ? options : window.catKind)
  }
}
function craftFunctionForList (to = '#catList', options = [] /*  ['name', 'Para'] */) {
  let func = () => true
  if (eq(options) !== eq([]) ||
    (options[0] !== null && options[1] !== null)) {
    if (options[0] === 'name') { // function For name
      func = (x) => (new RegExp(`^.*${options[1]}.*$`, 'm')).test(x[options[0]]) // regex -> /^.*Nemi.*$/m
    } else { // function for both tag and color
      func = (x) => cleanString(x[options[0]]).indexOf(options[1]) !== -1
    }
  }
  window.catKind = eq(options) === eq(window.catKind) ? [null, null, null] : options.slice() // does not change options
  window.catKind[2] = (window.fetchedCats.filter(func).length)
  // console.log(func.toSource())
  clearCatList(to)
  makeCatList4(`${baseURL}/api/all`, '#catList', func)
}

// main pages handler
async function pageButtonHandler (perPage = 15, direction, kind) {
  // perPage -> number of cat's pics per page i.e 15
  // direction -> 'next', 'prev', 'zero'
  // kind -> ['name', 'Para'] or ['color', 'Black']
  if (!window.fetchedCats) {
    await window.fetch(`${baseURL}/api/all`)
      .then(x => x.json())
      .then(function (x) { window.fetchedCats = x; return 0 })
  }
  let n
  switch (direction) {
    case 'zero':
      n = 0
      break
    case 'next':
      n = perPage
      break
    case 'prev':
      n = (-perPage)
      break
    default:
      n = 0
      break
  }
  if (!window.state) {
    window.state = [perPage, kind, 0, window.fetchedCats]
    //  [0, 1, 2, 3] = [perPage: 15, kind: ['color', 'Tricolor'], pageCnt: 0, currCatList: [{etc...}]]
  }
  const nl = eq(['null', 'null'])
  if (eq(kind) === nl) { window.state[2] += n }

  if (eq(window.state[1]) === nl) {
    if (eq(kind) === nl) {
      console.log('next page, Front page')
    } else {
      window.state[1] = kind
      window.state[2] = 0
    }
  } else if (eq(kind) !== eq(window.state[1])) {
    if (eq(kind) === nl) {
      console.log('ok next or prev')
    } else {
      window.state[1] = kind
      window.state[2] = 0
    }
  }
  var func = () => true
  switch (window.state[1][0]) {
    case 'name':
      func = (x) => (new RegExp(`^.*${window.state[1][1]}.*$`, 'm')).test(x[window.state[1][0]])
      break
    case 'color':
      func = (x) => cleanString(x[window.state[1][0]]).indexOf(window.state[1][1]) !== -1
      break
    case 'tags':
      func = (x) => cleanString(x[window.state[1][0]]).indexOf(window.state[1][1]) !== -1
      break
    default:
      func = () => true
  }
  window.state[4] = func

  const error = document.getElementById('error')
  const newPage = window.state[2]

  if (newPage < 0) {
    window.state[2] -= n
    error.innerText = `You're at the begining!`
    return 0
  } else if (newPage > window.state[3].filter(window.state[4]).length) {
    window.state[2] -= n
    error.innerText = `No more cats for now!`
    return 0
  } else {
    error.innerText = ''
    error.innerHTML = `<img src="./pinkCat2.png" alt="cute kitty" class="catPageIcon">`
    setTimeout(function () { window.scroll({ top: 0, behavior: 'smooth' }) }, 200)
  }
  await clearCatList('#catList')
  await catListToDom('#catList', window.state[4])
  await console.log(state)
  return 0
}
// End of pageButtonHandler

async function catListToDom (to = '#catList', func = (() => true)) {
  const parent = document.querySelector(to)
  const low = window.state[2]
  window.state[3]
    .filter(func).slice(0 + low, 15 + low)
    .forEach(x =>
      parent.append(
        createCatCard(x.name, x.description, x.file_name, x.up_date, x.id)))
}

function clearCatList (catList = '#catList') {
  const list = document.querySelector(catList)
  while (list.hasChildNodes()) {
    list.removeChild(list.firstChild)
  }
}

function toggleButton (button = '#edit-button') {
  let btnList = document.querySelectorAll(button)
  btnList.forEach(btn => {
    if (btn.style.display === 'none') {
      btn.style.display = 'block'
    } else {
      btn.style.display = 'none'
    }
  })
}

function newCatList (url, to = '#catList') {
  clearCatList(to)
  makeCatList3(url, to)
}

/* function clearCookies () {
  exp = '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  return exp
} */

function buttonEditHandler () {
  const nodeList = this.parentElement.parentElement
  const catId = nodeList.childNodes[5].innerText
  window.location = `${baseURL}/edit#${catId}`
}

function buttonDeleteHandler () {
  const nodeList = this.parentElement.parentElement
  const catId = nodeList.childNodes[5].innerText
  window.location = `${baseURL}/delete#${catId}`
}

function cleanString (s) { // cleanString :: String -> Array (Of strings)
  // '\{\"Tricolor\", \"B&W\"\}' -> ['Tricolor', 'B&@']
  if (!s) { return [] } // if null -> []
  return s.split('')
    .filter(a => /[^({|}|\")]/.test(a))
    .join('')
    .split(',')
}

function nextCats () {
  clearCatList('#catList')
  makeCatList4('', '#catList')
  window.setTimeout(() => window.scroll({ top: 0, behavior: 'smooth' }), 1500)
}

const baseURL = `${window.location.protocol}//${window.location.host}`
/* window.onload = async function () {
  await makeCatList4(`${baseURL}/api/all`, '#catList')
  // await pageButtonHandler(`${baseURL}/api/all`, 'zero', null)
} */
window.onload = pageButtonHandler(15, 'zero', ['null', 'null'])
// 'listen to change of url, if the #1 part is #edit, toggle the buttons'
window.onpopstate = function (x) {
  if (this.document.location.hash === '#edit') {
    toggleButton()
  }
}
