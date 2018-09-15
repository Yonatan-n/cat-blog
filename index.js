const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const multer = require('multer')
const multerS3 = require('multer-s3-transform') // not "multer-s3", but "multer-s3-transform"
const AWS = require('aws-sdk')
const sharp = require('sharp')
require('dotenv').config() // this add the env vars in the .env file to the process.env, importent for AWS, postgesql and form password
const awsConfig = {
  'region': 'us-east-1',
  'accessKeyId': process.env.accessKeyId, // When you push to 'prod' on heroku, make sure
  'secretAccessKey': process.env.secretAccessKey // you have a .env file with all the creds
}
AWS.config.update(awsConfig)
const s3 = new AWS.S3()
const PORT = process.env.PORT || 5000
// Heroku Postgresql
const { Pool } = require('pg')
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://vrfxhodtqyfprc:36b401c890699b83a74f92c4cebd21c29de6dbcbaac7fbab0865ee2b9bafcd4c@ec2-50-16-196-57.compute-1.amazonaws.com:5432/d6v73t2rti2ka',
  ssl: true
})
pool.on('error', (err, client) => {
  console.error('(postgres pooling error) Unexpected error on idle client', err)
  process.exit(-1)
})
// Heroku Postgresql
const pathToPublic = `${__dirname}/resources/public`
const password = process.env.formPassword
const urlencodedParser = bodyParser.urlencoded({ extended: true })

app.use(express.static(pathToPublic))
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())
app.use((req, res, next) => {
  req.reqTime = new Date()
  next()
})
app.use((req, res, next) => { // simple requests logger
  console.log(`got ${req.method} request at ${req.url} on: ${req.reqTime}`)
  next()
})

// page navigetion stuff HOME | UPLOAD | SEARCH

app.get('/', (req, res) =>
  res.redirect('/home')) // (path.join(__dirname, p2f, "index.html")))

app.get('/home', (req, res) => {
  // console.log(req.query)
  res.sendFile(path.join(pathToPublic, 'index.html'))
})

app.get('/upload', (req, res) =>
  res.sendFile(path.join(pathToPublic, 'upload.html')))

app.get('/search', (req, res) =>
  res.sendFile(path.join(pathToPublic, 'search.html')))

app.get('/cardGrid', (req, res) =>
  res.sendFile(path.join(pathToPublic, 'carGrid.html')))

// api stuff
app.get('/api/img1/:name', (req, res) => // old
  res.sendFile(path.join(__dirname, '/resources/public/images', req.params.name)))

app.get('/api/img/:img', (req, res) =>
  // res.send(req.params.filePath))
  res.sendFile(path.join(__dirname, `resources/postedCats`, req.params.img)))

app.get('/api/all', (req, res) =>
  pool.query(`SELECT * FROM cat_table_s3 ORDER BY up_date DESC`, (err, result) => {
    if (err) throw err
    res.send(result.rows)
  }))

app.get('/api/color/:color', (req, res) => {
  const colorList = ['Tricolor', 'Ginger', 'Black', 'White', 'B&W', 'Grey', 'No Color'] // color options
  const color = req.params.color
  if (!(colorList.some(x => x === color))) { // validate color before injecting to sql string
    res.send(`"${color}" is not a valid color of cat!`) // error message
  } else {
    pool.query(`SELECT * FROM cat_table_s3 WHERE COLOR LIKE '%${color}%' ORDER BY up_date DESC`, (err, result) => {
      if (err) throw err
      res.send(result.rows)
    })
  }
})

app.get('/api/tags/:tag', (req, res) => {
  const tagList = ['Kitten', 'Dog', 'Fat', 'Special']
  const tag = req.params.tag
  if (!(tagList.some(x => x === tag))) {
    res.send(`"${tag}" is not a valid tag of cat!`)
  } else {
    pool.query(`SELECT * FROM cat_table_s3 WHERE tags LIKE '%${tag}%' ORDER BY up_date DESC`, (err, result) => {
      if (err) throw err
      res.send(result.rows)
    })
  }
})

app.get('/api/name/:name', (req, res) => {
  const tagList = ['Nemi', 'Para', 'Poki', 'Elizabeth', 'Mastick']
  const name = req.params.name
  if (!(tagList.some(x => x === name))) {
    res.send(`"${name}" is not a valid name of cat!`)
  } else {
    pool.query(`SELECT * FROM cat_table_s3 WHERE name LIKE '%${name}%' ORDER BY up_date DESC`, (err, result) => {
      if (err) throw err
      res.send(result.rows)
    })
  }
})
/* s3.getObject({
  Bucket: "cat-blag-bucket",
  Key: "cat-blag-s3/catPic-Sun-Sep-02-2018-09:50:16.jpg"
}, (err, data) => {
  if (err) throw err
  console.log(data.Body.toString())
}) */
app.get('/api/s3Ls', (req, res) => {
  s3.listObjectsV2({ Bucket: 'cat-blag-bucket' }, (err, data) => {
    if (err) throw err
    console.log(`all good s3 mann\n${JSON.stringify(data.Contents[4].Key)}`)
  })
})

const makeDateStr = (d) => `${d.toDateString().replace(/ /g, '-')}-${(d.toTimeString()).slice(0, 8)}`
// makeDateStr :: Date -> String
// looks like this -> 'Thu-Aug-30-2018-11:40:08'
// so the files will be CatName-Thu-Aug-30-2018-11:40:08.png

var upload = multer({
  fileFilter: (req, file, cb) => checkFileType(file, cb),
  storage: multerS3({
    s3: s3,
    bucket: 'cat-blag-bucket',
    acl: 'public-read',
    shouldTransform: function (req, file, cb) {
      cb(null, /^image/i.test(file.mimetype))
    },
    transforms: [{
      id: 'original',
      key: function (req, file, cb) {
        cb(null, `cat-blag-s3/${file.fieldname}-${makeDateStr(req.reqTime)}${makeExt(file.originalname)}`)
      },
      transform: function (req, file, cb) {
        cb(null, sharp().resize(500).jpeg())
      }
    }],
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname
      })
    },
    key: function (req, file, cb) {
      cb(null, `cat-blag-s3/${file.fieldname}-${makeDateStr(req.reqTime)}${makeExt(file.originalname)}`)
    }
  })
})
const makeExt = (s) => s.slice(s.lastIndexOf('.'))
function checkFileType (file, cb) {
  const filetypes = /jpeg|jpg|png|gif/ // Allowed ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase()) // Check ext
  const mimetype = filetypes.test(file.mimetype) // Check mime
  if (mimetype && extname) {
    return cb(null, true)
  } else {
    const err = 'Error: Images Only!' // for the standard style checker
    cb(err)
  }
}
app.post('/upload', upload.single('catPic'), (req, res) => {
  if (req.file === undefined) {
    res.send('No fuckin file!')
  } else {
    const cat = JSON.parse(JSON.stringify(req.body)) // format cat body so you can use it
    if (cat.password !== password) {
      return res.send(`<h1 style="color: blue;">incorrect password, try again love</h1>`)
    }
    res.redirect('/home')
    const text = `insert into cat_table_s3 
      (NAME,DESCRIPTION,COLOR,TAGS,file_name)
      VALUES ($1,$2,$3,$4,$5)`
    const values = [cat.catName, cat.catDesc, cat.catColor, cat.catTag,
      // https://s3.amazonaws.com/cat-blag-bucket/cat-blag-s3/catPic-Sun-Sep-02-2018-19:19:04.jpg
      `https://s3.amazonaws.com/cat-blag-bucket/cat-blag-s3/${req.file.fieldname}-${makeDateStr(req.reqTime)}${makeExt(req.file.originalname)}`]
    pool.query(text, values, (err, result) => {
      if (err) throw err
      // console.log(result.rows, `Also the date is: ${req.reqTime}`,`Values are: ${values}`) // OK, so what you gonna do is this:
    })
  }
})

app.get('/upload2', (req, res) => {
  res.send('alright')
})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`))
