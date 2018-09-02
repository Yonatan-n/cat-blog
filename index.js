const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs');
const bodyParser = require('body-parser')
//const mongoose = require('mongoose')
const multer = require('multer')
const multers3 = require('multer-s3')
//const Binary = require('mongodb').Binary
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

app.get('/api/fs', (req, res) => 
  pool.query(`select * FROM fs_test`, (err, result) => {
    if (err) throw err
    res.send(result.rows)
}))


app.get('/api/Dir', (req, res) => res.send(__dirname))

const makeDateStr = (d) => `${d.toDateString().replace(/ /g, "-")}-${(d.toTimeString()).slice(0,8)}`
// makeDateStr :: Date -> String
// looks like this -> 'Thu-Aug-30-2018-11:40:08'
// so the files will be CatName-Thu-Aug-30-2018-11:40:08.png
const storage = multer.diskStorage({
  destination: './resources/postedCats/',
  filename: function(req, file, cb){
    cb(null,`${file.fieldname}-${makeDateStr(new Date)}${path.extname(file.originalname)}`);
  }
})
const upload = multer({
  storage: storage,
  limits:{fileSize: 10000000},
  fileFilter: function(req, file, cb) {
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
  upload(req, res, (err) => {
    if(err){
      res.send("Error!: " + err);
    } else if(req.file === undefined){
        res.send('No fuckin file!')
    } else {
      const cat = JSON.parse(JSON.stringify(req.body)) // format cat body so you can use it
      if (cat.password !== password) {
        return res.send(`<h1 style="color: blue;">incorrect password, try again love</h1>`)
      }
      //const imgName = req.file.filename
      const text = `insert into fs_test 
      (name, fileblob)
       VALUES ($1,$2)` // ,$3,$4,$5
      fs.readFile(path.join(__dirname, 'resources', 'postedCats', req.file.filename), (err, data) => {
        if (err) throw err
          const values = [cat.catName/*, cat.catDesc, cat.catColor, cat.catTag*/, data]      
          pool.query(text, values, (err, result) => {
            if (err) throw err
            console.log(result.rows) // OK, so what you gonna do is this:
            //                       use multer to save a pic "catPic.jpg" (?)
            //                       to the filesystem and then, read it with fs
            //                       and insert it to the heroku DB, once you got that
            //                       going, switch to the AWS DB,
            //                       then you could move on and make some ui changes adn so on
          })
      })
      res.redirect("/home")      
      }
  })
})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`))
