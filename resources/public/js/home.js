function makeCatList1 () {
  const daList = document.getElementById('imgls')
  catCardTemplate = (x) => `
    <li class="text-center">cat name: ${x.name}<br/>
                                      cat desc: ${x.desc}<br/>
                                      <img src="${x.img}" alt="cat pic" width="100px" height="100px" class="mx-auto d-block">
                                      </li>`
  daList.innerHTML = xs.map((x) => catCardTemplate(x))
    .reduce((a, b) => a + b, '')
}

function makeCatList2 () {
  const x = document.querySelector('template').content
  document.querySelector('#catList').appendChild(
    document.importNode(x, true))
}

function useIt () { // Make a vanilla js compouent of the cat-card-thing
  const x = document.querySelector('template').content
  document.querySelector('#catList').appendChild(
    document.importNode(x, true))
}

// useIt()
function changeCatPic () {
  let img = document.querySelector('#catPic')
  fetch('http://localhost:5000/img/cat5.jpg')
    .then((x) => x.blob())
    .then((x) => img.src = URL.createObjectURL(x))
}

function createCatCard (name, desc, imgPath, up_date) {
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
  let aButton = document.createElement('button')
  // aButton.style = 'cursor:pointer'
  aButton.name = 'editButton'
  aButton.className = 'btn btn-primary'
  aButton.innerText = 'Edit'
  aButton.onclick = buttonEventHandler // This is the buttons Event Handler
  catButton.appendChild(aButton)
  cardBody.append(img, cardTitle, cardDesc, catDate, catButton)
  catCard.appendChild(cardBody)
  return catCard
}

function appendCatList (xs, to) {
  document.querySelector(to).append(xs)
}

function makeCatList3 (url, to) {
  const parent = document.querySelector(to)
  fetch(url)
    .then(a => a.json())
    .then(xs => xs.forEach(x =>
      parent.append(
        createCatCard(x.name, x.description, x.file_name, x.up_date))))
}

const baseURL = `${window.location.protocol}//${window.location.host}`
window.onload = makeCatList3(`${baseURL}/api/all`, '#catList')

function newCatList (url, to = '#catList') {
  clearCatList()
  console.log('newCatList works', url, to)
  makeCatList3(url, to)
}

function clearCatList () {
  const list = document.querySelector('#catList')
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

function clearCookies () {
  exp = '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  return exp
}

function buttonEventHandler () {
  const imgUrl = this.parentElement.parentElement.childNodes[0].src
  const imgName = imgUrl.slice(53)
  window.fetch(`${baseURL}/api/one/${imgName}`)
    .then(x => x.json())
    .then(x => document.cookie = `cat = ${JSON.stringify(x)}`)
    .then(() => window.location = `${baseURL}/edit`)
}

// 'listen to change of url, if the #1 part is #edit, toggle the buttons'
window.onpopstate = function (x) {
  if (this.document.location.hash === '#edit') {
    toggleButton()
  }
}
