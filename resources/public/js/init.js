const imported = document.querySelector("link[rel='import']")// you need to import this before window.onload

window.onload = initPage()

function initPage() {
  if ('import' in imported) { // only chrome
    chromeHtmlImport()
  } else { // ajax
    importTemplateTo2('https://localhost:5000/templates/nav.html', 'header')
  }
}

function importTemplateTo2(temp, to) {
  var root = document.querySelector("header")
  fetch(temp)
    .then(x => x.text())
    .then(x => root.innerHTML = x)
}

function importTemplateTo(temp, to) {
  let ajax = new XMLHttpRequest()
  ajax.open("GET", temp, aysnc=false)
  ajax.send()
  document.querySelector(to).innerHTML = ajax.responseText
}

function chromeHtmlImport() {
  // first you need to get imported ->
  //imported = document.querySelector("link[rel='import']")
  const content = imported.import
  const hd = document.createElement("div")

  const title = content.querySelector("#head-title")
  const nav = content.querySelector('#nav-bar')
  hd.append(title, nav)

  document.querySelector("header").append(hd)
}
