const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs');
const bodyParser = require('body-parser')
const multer = require('multer')
const multerS3 = require('multer-s3')
const AWS = require("aws-sdk")

const awsConfig = {
  "region": "us-east-1",
  "accessKeyId": "AKIAJ7A2XOBNLOKRZ6MA",
  "secretAccessKey":"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"
}
AWS.config.update(awsConfig)

const s3 = new AWS.S3
const PORT = process.env.PORT || 5000

// Heroku Postgresql
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://vrfxhodtqyfprc:36b401c890699b83a74f92c4cebd21c29de6dbcbaac7fbab0865ee2b9bafcd4c@ec2-50-16-196-57.compute-1.amazonaws.com:5432/d6v73t2rti2ka",
  ssl: true
})
pool.on('error', (err, client) => {
  console.error('(postgres pooling error) Unexpected error on idle client', err)
  process.exit(-1)
})
// Heroku Postgresql
const pathToPublic = `${__dirname}/resources/public`
const password = "dishwasherunderwear" // dish washer under wear
const urlencodedParser = bodyParser.urlencoded({ extended: true })

// my util functions
function makeTimeString(date) {
    const dStr = date.toDateString()
    const dTime = date.toTimeString().split(' ')[0]
    return `${dStr} -> ${dTime}`
}

//executeSqlPromise = (sql)
executeSql = (sql) =>
  pool.query(sql, (err, result) => {
    if (err) throw err
    return(result.rows)
  })

executeSqlLog = async (sql) => {
  console.log('starts sql query')
  try {
    const client = await pool.connect()
    const result = await client.query(sql)
    console.log(result.rows)
    client.release()
  } catch (err) {
    console.error(err)
  }
}
// you need to make a res.send out put to the executeSql
// my util functions

app.use(express.static(pathToPublic))
app.use(bodyParser.urlencoded({ extended: true}))
//app.use(bodyParser.json())
app.use((req, res, next) => { //simple requests logger
  console.log(`got ${req.method} request at ${req.url}`)
  next()
})

//page navigetion stuff

app.get('/', (req, res) =>
  res.redirect('/home')) //(path.join(__dirname, p2f, "index.html")))

app.get('/home', (req, res) =>
  res.sendFile(path.join(pathToPublic, "index.html")))

app.get('/upload', (req, res) =>
  res.sendFile(path.join(pathToPublic, "upload.html")))

app.get('/search', (req, res) =>
  res.sendFile(path.join(pathToPublic, "search.html")))

//api stuff
app.get('/api/img1/:name', (req,res) => // old
  res.sendFile(path.join(__dirname, "/resources/public/images", req.params.name)))

app.get('/api/img/:img', (req, res) =>
  //res.send(req.params.filePath))
  res.sendFile(path.join(__dirname, `resources/postedCats` ,req.params.img)))

app.get('/api/all', (req, res) =>
  pool.query(`SELECT * FROM cat_table`, (err, result) => {
    if (err) throw err
    res.send(result.rows)
  }))

/* s3.getObject({
  Bucket: "cat-blag-bucket",
  Key: "cat-blag-s3/catPic-Sun-Sep-02-2018-09:50:16.jpg"
}, (err, data) => {
  if (err) throw err
  console.log(data.Body.toString())
}) */
app.get('/api/s3Ls', (req, res) => {
  s3.listObjectsV2({Bucket: 'cat-blag-bucket'}, (err, data) => {
    if (err) throw err
    console.log(`all good s3 mann\n${JSON.stringify(data.Contents[4].Key)}`)
  })
})

app.get('/api/Dir', (req, res) => res.send(__dirname))

const makeDateStr = (d) => `${d.toDateString().replace(/ /g, "-")}-${(d.toTimeString()).slice(0,8)}`
// makeDateStr :: Date -> String
// looks like this -> 'Thu-Aug-30-2018-11:40:08'
// so the files will be CatName-Thu-Aug-30-2018-11:40:08.png

var upload = multer({
  fileFilter: (req, file, cb) => checkFileType(file, cb),
  storage: multerS3({
    s3: s3,
    bucket: 'cat-blag-bucket',
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname
      });
    },
    key: function (req, file, cb) {
      cb(null, `cat-blag-s3/${file.fieldname}-${makeDateStr(new Date)}${makeExt(file.originalname)}`)
    }
  })
})
const makeExt = (s) => s.slice(s.lastIndexOf('.'))
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
app.post('/upload', upload.single('catPic'), (req, res) => {  
     if(req.file === undefined){
        res.send('No fuckin file!')
    } else {
      const cat = JSON.parse(JSON.stringify(req.body)) // format cat body so you can use it
      if (cat.password !== password) {
        return res.send(`<h1 style="color: blue;">incorrect password, try again love</h1>`)
      }
      res.redirect("/home")      
      const text = `insert into cat_table_s3 
      (NAME,DESCRIPTION,COLOR,TAGS,file_name)
      VALUES ($1,$2,$3,$4,$5)`
      const values = [cat.catName, cat.catDesc, cat.catColor, cat.catTag, s3_name/* req.file.fieldname */]      
          pool.query(text, values, (err, result) => {
            if (err) throw err
            console.log(result.rows) // OK, so what you gonna do is this:
          })
      }
})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`))
