function changeCatPic () {
  let img = document.querySelector('#catPic')
  window.fetch('http://localhost:5000/img/cat5.jpg')
    .then((x) => x.blob())
    .then((x) => img.src = URL.createObjectURL(x))
}

function createCatCard (name, desc, imgPath, upDate) {
  console.log(imgPath)
  let catCard = document.createElement('div')
  catCard.className = 'catCard card'
  catCard.style.borderColor = '#f29e91'
  catCard.style.width = 'auto'
  /*   catCard.style.minWidth = '14em' // THIS IS THE NEW RESIEZ THING!!!!
  catCard.style.maxWidth = '14em' */
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
    catDate.innerText = makeFormatDate(upDate) // eslint-disable-line
  catDate.style.fontSize = '0.7em'
  // <p class="card-text" id='catDate' style="font-size: 0.9em;">29-08-2018</p>
  // end of def
  cardBody.append(img, cardTitle, cardDesc, catDate)
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
    .then(xs => xs.reverse()/* .slice(0, 4) */.forEach(x =>
      parent.append(
        createCatCard(x.name, x.description, x.file_name, x.up_date))))
}

const baseURL = `${window.location.protocol}//${window.location.host}`
window.onload = makeCatList3(`${baseURL}/api/all`, '#catList')
