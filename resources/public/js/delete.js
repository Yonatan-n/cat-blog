const baseURL = `${window.location.protocol}//${window.location.host}`

document.onload = fetch(`${baseURL}/api/byId/${(document.location.hash).slice(1)}`)
  .then(x => x.json())
  .then(x => {
    document.getElementById('theId').innerText = x.id
    document.getElementById('name').innerText = x.name // change name to cat name
    document.getElementById('desc').innerText = x.description // change desc to cat desc
    document.getElementById('image').src = x.file_name
  })

function deleteButtonHandler () {
  const theId = document.getElementById('theId').innerText
  fetch(`${baseURL}/api/delete/${theId}`)
    .then(() => console.log('done'))
    .then(() => window.location = `${baseURL}/home`)
}
