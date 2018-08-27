const xs = [
  {name: "coolCat", desc: "this is a wicked cat! watch out boys!", img: "images/cat1.jpg"},
  {name: "neat kit", desc: "this is a neat little kitty", img: "images/cat2.jpg"},
  {name: "Cat", desc: "just a reguler 'Ol CAT'", img: "images/cat3.jpg"},
  {name: "Cat", desc: "just a reguler 'Ol CAT'", img: "images/cat4.jpg"},
  {name: "Cat", desc: "just a reguler 'Ol CAT'", img: "images/cat5.jpg"}
]

window.onload = makeCatList3(xs, "#catList")
function makeCatList1() {
    const daList = document.getElementById('imgls')
    catCardTemplate = (x) => `
    <li class="text-center">cat name: ${x.name}<br/>
                                      cat desc: ${x.desc}<br/>
                                      <img src="${x.img}" alt="cat pic" width="100px" height="100px" class="mx-auto d-block">
                                      </li>`
  daList.innerHTML = xs.map((x) => catCardTemplate(x))
                    .reduce((a,b) => a + b, "")

}

function makeCatList2() {
    const x = document.querySelector("template").content
    document.querySelector('#catList').appendChild(
        document.importNode(x, true))
}

function useIt() { // Make a vanilla js compouent of the cat-card-thing!1
    const x = document.querySelector("template").content
    document.querySelector('#catList').appendChild(
        document.importNode(x, true));
  }

//useIt()
function changeCatPic() {
  let img = document.querySelector("#catPic")
  fetch("http://localhost:5000/img/cat5.jpg")
    .then((x) => x.blob())
    .then((x) => img.src = URL.createObjectURL(x))
}

function createCatCard(name, desc, imgPath) {
  let catCard = document.createElement("div")
  catCard.className = "card"
  let cardBody = document.createElement("div")
  cardBody.className = "card-body"
  let img = document.createElement("img")
  img.src = imgPath
  img.alt = "cat pic"
  img.className = "card-img-top d-block"
  let cardTitle = document.createElement("h5")
  cardTitle.className = "card-text text-center"
  cardTitle.innerText = name
  let cardDesc = document.createElement('p')
  cardDesc.className = "card-text"
  cardDesc.innerText = desc
  // end of def
  cardBody.append(img, cardTitle, cardDesc)
  catCard.appendChild(cardBody)
  return catCard
}
function appendCatList(xs, to) {
  document.querySelector(to).append(xs)
}

function makeCatList3(xs, to) {
  const parent = document.querySelector(to)
  const ls = xs.forEach(x =>
    parent.append(
    createCatCard(x.name, x.desc, x.img)))
}
