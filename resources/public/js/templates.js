const tempNavBar = `
<div class="header-nav">

    <div class="container-fluid color-peach p-5 text-white headerFont" id="head-title">
      <h3 class="text-center" id="page-title">cat blag</h3>
    </div>

    <nav class="navbar navbar-expand-sm color-bg" id="nav-bar">
      <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link text-white hoverNav" href="home">Home Feed</a>
          </li>
          <li class="nav-item">
              <a class="nav-link text-white hoverNav" href="upload">Upload</a>
          </li>
          <li class="nav-item">
          <div class="dropdown">
            <button class="dropbtn"><a class="nav-link">Choose a cat</a></button>
            <div class="dropdown-content">
             <a href="#1" onclick="newCatList(baseURL + '/api/tags/Kitten', '#catList')">Kittens</a>
             <a href="#2">By Named</a>
             <a href="#3">By Color</a>
            </div>
          </div>
        </li>
        </ul>
    </nav>

  </div>`

window.onload = (() =>
  document.querySelector('header').innerHTML = tempNavBar)()
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
