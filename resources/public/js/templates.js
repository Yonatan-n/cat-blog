const tempNavBar = `
<div class="header-nav">

    <div class="container-fluid color-peach p-5 text-white headerFont" id="head-title">
      <h3 class="text-center" id="page-title">cat blag</h3>
    </div>

    <nav class="navbar navbar-expand-sm color-bg" id="nav-bar">
      <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link text-white hoverNav" href="home">Home</a>
          </li>
          <li class="nav-item">
          <div class="dropdown">
            <button class="dropbtn"><a class="nav-link">Names</a></button>
            <div class="dropdown-content">
              <a href="#1" onclick="newCatList(baseURL + '/api/name/Nemi', '#catList')">Nemi</a>
              <a href="#2" onclick="newCatList(baseURL + '/api/name/Para', '#catList')">Para</a>
              <a href="#3" onclick="newCatList(baseURL + '/api/name/Poki', '#catList')">Poki</a>
              <a href="#4" onclick="newCatList(baseURL + '/api/name/Elizabeth', '#catList')">Elizabeth</a>
              <a href="#5" onclick="newCatList(baseURL + '/api/name/Mastick&W', '#catList')">Mastick</a>
            </div>
          </div>
          </li>
          <li class="nav-item">
          <div class="dropdown">
            <button class="dropbtn"><a class="nav-link">Colors</a></button>
            <div class="dropdown-content">
              <a href="#1" onclick="newCatList(baseURL + '/api/color/Tricolor', '#catList')">Tricolor</a>
              <a href="#2" onclick="newCatList(baseURL + '/api/color/Ginger', '#catList')">Ginger</a>
              <a href="#3" onclick="newCatList(baseURL + '/api/color/Black', '#catList')">Black</a>
              <a href="#4" onclick="newCatList(baseURL + '/api/color/White', '#catList')">White</a>
              <a href="#5" onclick="newCatList(baseURL + '/api/color/B&W', '#catList')">Black & White</a>
              <a href="#6" onclick="newCatList(baseURL + '/api/color/Grey', '#catList')">Grey</a>
              <a href="#7" onclick="newCatList(baseURL + '/api/color/No Color', '#catList')">No Color</a>
            </div>
          </div>
          </li>
          <li class="nav-item">
          <div class="dropdown">
            <button class="dropbtn"><a class="nav-link">Tags</a></button>
            <div class="dropdown-content">
              <a href="#1" onclick="newCatList(baseURL + '/api/tags/Kitten', '#catList')">Kittens</a>
              <a href="#2" onclick="newCatList(baseURL + '/api/tags/Fat', '#catList')">Fattys</a>
              <a href="#3" onclick="newCatList(baseURL + '/api/tags/Dog', '#catList')">Dogs</a>
              <a href="#4" onclick="newCatList(baseURL + '/api/tags/Special', '#catList')">Special</a>
            </div>
          </div>
          </li>
      </ul>
    </nav>
</div>`

const buttonTemp = `
<button onclick="window.scroll(0,0)" id="toTopButton" title="Go to top">
  <img src="./arrow.png" alt="upArrow" style="height: 2em;">  
</button>`

window.onload = (function () {
  document.querySelector('header').innerHTML = tempNavBar
  document.querySelector('#buttonToTop').innerHTML = buttonTemp
})()

window.onscroll = function () { scrollFunction() }

function scrollFunction () {
  if (window.scrollY > 50) {
    document.getElementById('toTopButton').style.display = 'block'
  } else {
    document.getElementById('toTopButton').style.display = 'none'
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction () {
  window.scroll(0, 0)
  /* document.body.scrollTop = 0; legacy, not needed?
      document.documentElement.scrollTop = 0; */
}
/* <li class="nav-item dropdown">
  <a class="nav-link text-white dropdown-toggle" href="#search" data-toggle="dropdown" role="button">Search 4 cats</a>
  <div class="dropdown-menu">
    <a class="dropdown-item" href="#1">link1</a>
  </div>
</li>

<li class="nav-item dropdown">
<a class="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown" role="button" aria-haspopup="true" aria-expanded="false">
Choose Cats
</a>
<div class="dropdown-menu" aria-labelledby="navbarDropdown">
<a class="dropdown-item" href="#">Action</a>
<a class="dropdown-item" href="#">Another action</a>
<div class="dropdown-divider"></div>
<a class="dropdown-item" href="#">Something else here</a>
</div>
</li>
*/
