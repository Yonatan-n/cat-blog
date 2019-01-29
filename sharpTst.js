const sharp = require('sharp')
const fs = require('fs')

// console.log(lib.addOneTox(7))
// console.log(lib)
/* fs.readFile('/home/yonatan/Downloads/catPic-Wed-Sep-05-2018-11_04_35.jpg', (err, data) => {
  if (err) throw err
  sharp(data)
    /* .jpeg({
      quality: 65,
      chromaSubsampling: '4:2:0'
    })
    .resize(400)
    .toFile('./testImg.jpg', (err) => err ? console.log(err) : console.log('ok'))
}) */

/*
fs.readdir('/tmp/awsss', (err, maPics) => {
  if (err) return null // throw err
  const p = '/tmp/awsss/'
  maPics.forEach(pic => {
    fs.readFile(`/tmp/awsss/${pic}`, (err, data) => {
      if (err) throw err
      resizeMe(`/tmp/awsss/${pic}`, pic)
    })
  })
}) */
function resizeMe (me, pic) {
  fs.readFile(me, (err, data) => {
    if (err) throw err
    sharp(data)
      .rotate()
      .toFile(`/home/yonatan/Pictures/tmp/${pic}`)
  })
  console.log('done as in DONE SON')
}

const p = `catPic-Wed-Sep-05-2018-11:18:03.jpg`
resizeMe(`./nogood.jpg`, 'side.jpg')
