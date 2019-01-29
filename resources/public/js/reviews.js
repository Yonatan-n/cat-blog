const baseURL = `${window.location.protocol}//${window.location.host}`
const buttonComment = `
<button data-toggle="modal" data-target="#commentModal" id="toCommentButton" title="Click here to add a comment">
  <img src="./add.png" alt="comment" style="height: 2em;"> 
</button>`

window.onload = function () {
  document.querySelector('#buttonToComment').innerHTML = buttonComment
  document.querySelector('#buttonToComment').addEventListener('click', handleCommentForm)
  loadComments()
}

function loadComments (commentList = '#commentList') {
  window.fetch(`${baseURL}/api/reviews`)
    .then(_ => _.json())
    .then(cmnt => {
      let ls = document.querySelector(commentList)
      ls.innerHTML = ''
      cmnt.forEach(x => {
        let div = document.createElement('div')
        div.classList.add('jumbotron', 'reviewType')
        let h = document.createElement('h4')
        let p = document.createElement('p')
        let d = document.createElement('p')
        d.classList.add('reviewDate')
        h.innerHTML = `&ldquo;${x.comment}&rdquo;` // `my name is ${x.name} i say:\n${x.comment}\non:\n${x.date}`
        p.innerText = `-${x.name}`
        d.innerText = x.up_date.slice(0, 10).split('-').reverse().join('-')
        div.append(h, p, d)
        ls.appendChild(div)
      })
    })
}

function handleCommentForm (e) {
  let form = document.querySelector('.commentInput')
  console.log(form)
  const formCss = window.getComputedStyle(form)
  form.style.display = formCss.display === 'none' ? 'block' : 'none'
}

function handleModal (e) {
  if (e.target.id === 'outerModal') { handleCommentForm(e) }
}

function submitForm (e) {
  loadComments()
  let form = document.querySelector('.commentInput')
  form.style.display = 'none'
}
