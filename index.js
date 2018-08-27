const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const multer = require('multer')
const Binary = require('mongodb').Binary
const PORT = process.env.PORT || 5000

const uristring =  process.env.MONGOLAB_URI ||
                   process.env.MONGOHQ_URL ||
                   'mongodb://127.0.0.1:27017'
const p2f = "resources/public"
const password = "catscatscats"
const urlencodedParser = bodyParser.urlencoded({ extended: true })

const catScheme = new mongoose.Schema({
  name: String, // check if name in the popular cats set
  desc: String, // nothing
  imgPath: String, // load the image from disk
  color: String, // check if length more then 0, if so, use tags
  //tags: Array
})
//popCat = ['Poki', 'Mastik', 'Elizabet', 'Nemi', 'Para']
//catsTag = ['Kitten', 'Dog?!', 'Fat', 'Special Breed']
//color = ["tri-color", "black & white", "black", 'white', 'ginger']
var catForm = mongoose.model('catForm', catScheme)
module.exports = catForm

function logThisTime(date) {
    const dStr = date.toDateString()
    const dTime = date.toTimeString().split(' ')[0]
    return `${dStr} -> ${dTime}`
}


app.use(express.static(p2f))
app.use(bodyParser.urlencoded({ extended: true}))
//app.use(bodyParser.json())
app.use((req, res, next) => {
  console.log(`got ${req.method} request at ${req.url}`)
  next()
})

//page navigetion stuff

app.get('/', (req, res) =>
  res.redirect('/home')) //(path.join(__dirname, p2f, "index.html")))

app.get('/home', (req, res) =>
  res.sendFile(path.join(__dirname, p2f, "index.html")))

app.get('/upload', (req, res) =>
  res.sendFile(path.join(__dirname, p2f, "upload.html")))

app.get('/search', (req, res) =>
  res.sendFile(path.join(__dirname, p2f, "search.html")))

//api stuff
app.get('/img/:name', (req,res) =>
  res.sendFile(path.join(__dirname, "/resources/public/images", req.params.name)))

app.get('/catPIC', (req, res) => {
  mongoose.connect(uristring)
  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error: '))
  db.once('open', () => {
    catForm.find({}, (err, cat) => {
      if (err) return console.error(err)
      console.log(cat)
    })
  })
})
app.get('/maCats', (req, res) => {
  mongoose.connect(uristring)
  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error: '))
  db.once('open', () => {
    catForm.find({}, (err, cat) => {
      if (err) return console.error(err)
      res.send(cat[0])
    })
  })
})
const storage = multer.diskStorage({
  destination: './resources/postedCats/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})
const upload = multer({
  storage: storage,
  limits:{fileSize: 10000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('catPic');
function checkFileType(file, cb){
  const filetypes = /jpeg|jpg|png|gif/; // Allowed ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Check ext
  const mimetype = filetypes.test(file.mimetype); // Check mime
  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}
app.post('/upload', (req, res) => {
  console.log(res.body)
  mongoose.connect(uristring)
  const db = mongoose.connection
  /* db.once('open', () => {
    const aCatForm = new catForm({name: req.body.catName, desc: req.body.catDesc, img: req.file})
    aCatForm.save((err, cat) => {
      if (err) throw err
      console.log(`all good! ${cat}`)
    })
    catForm.find({}, (err, cat) => {
      if (err) return console.error(err)
      console.log(cat)
    })
  }) */
  upload(req, res, (err) => {
    if(err){
      res.send("Error!: " + err);
    } else if(req.file === undefined){
        res.send('No fuckin file!')
    } else {
      catBody = JSON.stringify(req.body)
      console.log(catBody)
      console.log("\n\n\nBODYHERE\n\n\n")
      //const {catName, catDesc, catColor, catTag, password} = catBody
      //console.log(`cat NAME IS ${catName}`)
      const aCatForm = new catForm({
        name: catBody.catName,
        desc: catBody.catDesc,
        imgPath: `./resources/postedCats/${req.file.filename}`,
        color: catBody.catColor
      })
      console.log(aCatForm)
      aCatForm.save((err, cat) => {
        if (err) throw err
        console.log(`inserted ${cat} to the database!`)
      })
        /* fs.readFile(`./resources/postedCats/${req.file.filename}`, (err, imgFromDisk) => {
          if (err) throw err
          
        }) */
        console.log(`cat BODY: ${catBody}, cat file ${req.file.filename}`)
        res.sendFile(path.join(__dirname, 'resources' ,'postedCats' , req.file.filename))
      }
  })
})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`))

/*function base64ArrayBuffer(arrayBuffer) {
  var base64    = ''
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

  var bytes         = new Uint8Array(arrayBuffer)
  var byteLength    = bytes.byteLength
  var byteRemainder = byteLength % 3
  var mainLength    = byteLength - byteRemainder

  var a, b, c, d
  var chunk

  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
    d = chunk & 63               // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength]

    a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3)   << 4 // 3   = 2^2 - 1

    base64 += encodings[a] + encodings[b] + '=='
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

    a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

    base64 += encodings[a] + encodings[b] + encodings[c] + '='
  }
  
  return base64
}*/