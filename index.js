const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const PORT = process.env.PORT || 5000

const p2f = "resources/public"
app.use(express.static(p2f))

//normal nav stuff

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, p2f, "index.html")))

app.get('/home', (req, res) =>
  res.sendFile(path.join(__dirname, p2f, "index.html")))

app.get('/upload', (req, res) =>
  res.sendFile(path.join(__dirname, p2f, "upload.html")))

app.get('/search', (req, res) =>
  res.sendFile(path.join(__dirname, p2f, "search.html")))

//api stuff
app.get('/img/:name', (req,res) =>
  res.sendFile(path.join(__dirname, "/resources/public/images", req.params.name)))

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`))
