// copy_cat_table is a DEV database! please try not to use cat_table_s3 at development,
// sinces it's your PRODUCTION database, man!
const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const multer = require('multer')
const multerS3 = require('multer-s3-transform') // not "multer-s3", but "multer-s3-transform"
const AWS = require('aws-sdk')
const sharp = require('sharp')
const cookieParser = require('cookie-parser')
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
  connectionString: process.env.DATABASE_URL,
  ssl: true
})
pool.on('error', (err, client) => {
  console.error('(postgres pooling error) Unexpected error on idle client', err)
  process.exit(-1)
})
// Heroku Postgresql
const pathToPublic = `${__dirname}/resources/public`
const password = process.env.formPassword
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var jsonParser = bodyParser.json()
app.use(cookieParser())

app.use(express.static(pathToPublic))
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())
app.use((req, res, next) => {
  req.reqTime = new Date()
  next()
})
app.use((req, res, next) => { // simple requests logger
  console.log(`got ${req.method} request at ${req.url} on: ${req.reqTime} From ${req.connection.remoteAddress}`)
  next()
})

// page navigetion stuff HOME | UPLOAD | SEARCH
app.get('/cookie', (req, res) =>
  console.log(req.cookies))

app.get('/', (req, res) => // view
  res.redirect('/home')) // (path.join(__dirname, p2f, "index.html")))

app.get('/temp', (req, res) =>
  res.sendFile(path.join(pathToPublic, 'temp.html')))

app.get('/home', (req, res) => // view
  res.sendFile(path.join(pathToPublic, 'index.html')))

app.get('/about', (req, res) => // view
  res.sendFile(path.join(pathToPublic, 'about.html')))

app.get('/upload', (req, res) => // create
  res.sendFile(path.join(pathToPublic, 'upload.html')))

app.get('/edit', (req, res) => // update
  res.sendFile(path.join(pathToPublic, 'edit.html')))

app.get('/delete', (req, res) =>
  res.sendFile(path.join(pathToPublic, 'delete.html')))

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
    /* if (x.tags === null) {
        x.tags = []
      } */
    /* x.arr = x.arr.map(x => x.replace(/[^0-9a-zA-z]/gi)) */
  }))

app.get('/api/limit/:num', (req, res) =>
  pool.query(`SELECT * FROM cat_table_s3 ORDER BY up_date DESC LIMIT 10 OFFSET $1`, [req.params.num], (err, result) => {
    if (err) throw err
    res.send(result.rows)
  }))

/* app.get('/api/delete/:id', (req, res) => {
  console.log(req.params.password)
  if (req.params.password != password) {
    res.sendFile(path.join(pathToPublic, 'wrongPass.html'))
  } else {
    pool.query('DELETE FROM cat_table_s3 WHERE id = $1', [req.params.id], (err, result) => {
      if (err) throw err
      res.redirect('/home')
    })
  }
}) */

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

app.get('/api/one/:imgUrl', (req, res) => {
  const fullPicUrl = `https://s3.amazonaws.com/cat-blag-bucket/cat-blag-s3/${req.params.imgUrl}`
  pool.query('SELECT name, description, color, tags, id FROM cat_table_s3 WHERE file_name = $1', [fullPicUrl], (err, result) => {
    if (err) throw err
    // convert {1,2} -> [1,2]
    let sendThis = result.rows[0]
    const tempColor = sendThis.color
    const tempTag = sendThis.tags
    // start of color tag
    if (tempColor === undefined || tempColor === null) {
      sendThis.color = []
    } else if (tempColor.indexOf(',') !== -1) {
      sendThis.color = JSON.parse(`[${tempColor.slice(1, tempColor.length - 1)}]`)
    } else {
      sendThis.color = JSON.parse('["' + tempColor + '"]')
    } // end of color start of tags
    if (tempTag === undefined || tempTag === null) {
      sendThis.tags = []
    } else if (tempTag.indexOf(',') !== -1) {
      sendThis.tags = JSON.parse(`[${tempTag.slice(1, tempTag.length - 1)}]`)
    } else {
      sendThis.tags = JSON.parse('["' + tempTag + '"]')
    }
    // finally
    res.send(sendThis)
  })
})

app.get('/api/byId/:id', (req, res) => {
  pool.query('SELECT name, description, color, tags, file_name, id FROM cat_table_s3 WHERE id = $1', [Number(req.params.id)], (err, result) => {
    if (err) throw err
    res.send(result.rows[0])
  })
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
      return res.sendFile(path.join(pathToPublic, 'wrongPass.html'))
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
    })
  }
})

app.post('/edit', urlencodedParser, (req, res) => {
  const cat = JSON.parse(JSON.stringify(req.body))
  if (cat.password !== password) {
    return res.sendFile(path.join(pathToPublic, 'wrongPass.html'))
  }
  pool.query('UPDATE cat_table_s3 SET name = $1, description = $2, color = $3, tags = $4 WHERE id = $5', [cat.catName, cat.catDesc, cat.catColor, cat.catTag, cat.catId], (err, result) => {
    if (err) throw err
    res.redirect('/home')
  })
})
app.post('/delete', urlencodedParser, (req, res) => {
  const cat = JSON.parse(JSON.stringify(req.body))
  console.log(cat)
  if (cat.password !== password) {
    return res.sendFile(path.join(pathToPublic, 'wrongPass.html'))
  }
  pool.query('DELETE FROM cat_table_s3 WHERE id = $1', [cat.id], (err, result) => {
    if (err) throw err
    res.redirect('/home')
  })
})

app.get('/*', (req, res) => { // 404 page, any other page i didn't define route for
  return res.sendFile(path.join(pathToPublic, '404.html'))
})
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`))
