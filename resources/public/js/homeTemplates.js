const buttonTemp = `
<button onclick="window.scroll({top: 0, behavior: 'smooth'})" id="toTopButton" title="Go to top">
  <img src="./arrow.png" alt="upArrow" style="height: 2em;">  
</button>`

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
                  <a class="nav-link text-white hoverNav" href="about">About</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link text-white hoverNav" href="reviews">Reviews</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link text-white hoverNav" href="#cats">Cats</a>
                  <ul>
                    <li>
                      <a href="#">Name</a>
                      <ul>
                        <li>
                          <a href="#1" onclick="pageButtonHandler(0,'zero', ['name', 'Nemi'])">Nemi</a>
                        </li>
                        <li>
                            <a href="#2" onclick="pageButtonHandler(0,'zero', ['name', 'Para'])">Para</a>
                        </li>
                        <li>
                            <a href="#3" onclick="pageButtonHandler(0,'zero', ['name', 'Poki'])">Poki</a>
                        </li>
                        <li>
                            <a href="#4" onclick="pageButtonHandler(0,'zero', ['name', 'Elizabeth'])">Elizabeth</a>
                        </li>
                        <li>
                            <a href="#5" onclick="pageButtonHandler(0,'zero', ['name', 'Mastick'])">Mastick</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="#">Color</a>
                      <ul>
                        <li>
                            <a href="#1" onclick="pageButtonHandler(0,'zero', ['color', 'Tricolor'])">Tricolor</a>
                        </li>
                        <li>
                            <a href="#2" onclick="pageButtonHandler(0,'zero', ['color', 'Ginger'])">Ginger</a>
                        </li>
                        <li>
                            <a href="#3" onclick="pageButtonHandler(0,'zero', ['color', 'Black'])">Black</a>
                        </li>
                        <li>
                            <a href="#4" onclick="pageButtonHandler(0,'zero', ['color', 'White'])">White</a>
                        </li>
                        <li>
                            <a href="#5" onclick="pageButtonHandler(0,'zero', ['color', 'B&W'])">Black & White</a>
                        </li>
                        <li>
                            <a href="#6" onclick="pageButtonHandler(0,'zero', ['color', 'Grey'])">Grey</a>
                        </li>
                        <li>
                            <a href="#7" onclick="pageButtonHandler(0,'zero', ['color', 'No Color'])">No Color</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="#">Tags</a>
                      <ul>
                        <li>
                          <a href="#1" onclick="pageButtonHandler(0,'zero', ['tags', 'Kitten'])">Kittens</a>
                        </li>
                        <li>
                            <a href="#2" onclick="pageButtonHandler(0,'zero', ['tags', 'Fat'])">Fattys</a>
                        </li>
                        <li>
                            <a href="#3" onclick="pageButtonHandler(0,'zero', ['tags', 'Dog?!'])">Dogs</a>
                        </li>
                        <li>
                            <a href="#4" onclick="pageButtonHandler(0,'zero', ['tags', 'Special'])">Special Breed</a>
                        </li>
                        <li>
                            <a href="#5" onclick="pageButtonHandler(0,'zero', ['tags', 'CatsWithHats'])">Cats With Hats</a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
            </ul>
          </nav>
      </div>`

window.onload = (function () {
  document.querySelector('header').innerHTML = tempNavBar
  document.querySelector('#buttonToTop').innerHTML = buttonTemp
})()

window.onscroll = function () { scrollFunction() }

function scrollFunction () {
  document.getElementById('toTopButton').style.display = (
    window.scrollY > 600
      ? 'block'
      : 'none'
  )
}
