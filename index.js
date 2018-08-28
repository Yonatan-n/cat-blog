const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs');
const bodyParser = require('body-parser')
//const mongoose = require('mongoose')
const multer = require('multer')
//const Binary = require('mongodb').Binary
const PORT = process.env.PORT || 5000

// Heroku Postgresql
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://vrfxhodtqyfprc:36b401c890699b83a74f92c4cebd21c29de6dbcbaac7fbab0865ee2b9bafcd4c@ec2-50-16-196-57.compute-1.amazonaws.com:5432/d6v73t2rti2ka",
  ssl: true
});
// Heroku Postgresql
const p2f = "resources/public"
const password = "catscatscats"
const urlencodedParser = bodyParser.urlencoded({ extended: true })


// my util functions
function makeTimeString(date) {
    const dStr = date.toDateString()
    const dTime = date.toTimeString().split(' ')[0]
    return `${dStr} -> ${dTime}`
}
insertNewCat = async () => {
  const sql = "insert into cats_table (name, description, color, tags, img_path) VALUES ('quack_!quack', 'not a fucking normal cat, get lost normies', 'ginger', 'skinny', './dev/null/thing2' )"
  console.log('starts')
  try {
    const client = await pool.connect()
    const result = await client.query(sql);
    console.log(result.rows)
    client.release();
  } catch (err) {
    console.error(err);
  }
}
selectAllCats = async () => {
  console.log('starts')
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM cats_table');
    console.log(result.rows)
    client.release();
  } catch (err) {
    console.error(err);
  }
}
executeSql = async (sql) => {
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

// my util functions
app.use(express.static(p2f))
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
  res.sendFile(path.join(__dirname, p2f, "index.html")))

app.get('/upload', (req, res) =>
  res.sendFile(path.join(__dirname, p2f, "upload.html")))

app.get('/search', (req, res) =>
  res.sendFile(path.join(__dirname, p2f, "search.html")))

//api stuff
app.get('/img/:name', (req,res) =>
  res.sendFile(path.join(__dirname, "/resources/public/images", req.params.name)))

app.get('/catPIC', (req, res) => {
  selectAllCats()
})
app.get('/maCats', (req, res) => {
 /*  mongoose.connect(uristring)
  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error: '))
  db.once('open', () => {
    catForm.find({}, (err, cat) => {
      if (err) return console.error(err)
      res.send(cat)
    })
  }) */
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
  upload(req, res, (err) => {
    if(err){
      res.send("Error!: " + err);
    } else if(req.file === undefined){
        res.send('No fuckin file!')
    } else {
      cat = JSON.parse(JSON.stringify(req.body)) // format cat body so you can use it
      pathToImg = path.join(__dirname,'resources','postedCats',req.file.filename)
      const sql = `insert into cats_table 
      (name, description, color, tags, img_path)
       VALUES 
       ('${cat.catName}', '${cat.catDesc}', '${cat.catColor}', '${cat.catTag}', '${pathToImg}')`
      //executeSql(sql)
        console.log(`test: ${cat["catName"]}`)
        console.log(`cat BODY: ${cat}.\n\ncat file ${req.file.filename}\n\nsql => ${sql}`)
        res.sendFile(pathToImg)
      }
  })
})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`))
