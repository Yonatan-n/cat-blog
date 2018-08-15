const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const path = require('path')

app.use(express.static("resources/public"))
app.get('/', (req, res) => res.send('cat blag'))
app.get('/img/:name', (req,res) =>
  res.sendFile(path.join(__dirname, "/resources/public/images", req.params.name)))

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`))
