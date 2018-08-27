from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
@app.route('/index')
def rootIndex():
    return render_template('indexTest.html', thing="rendered hard!")



'''app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, p2f, "index.html")))

app.get('/home', (req, res) =>
  res.sendFile(path.join(__dirname, p2f, "index.html")))

app.get('/upload', (req, res) =>
  res.sendFile(path.join(__dirname, p2f, "upload.html")))

app.get('/search', (req, res) =>
  res.sendFile(path.join(__dirname, p2f, "search.html")))

//api stuff
app.get('/img/:name', (req,res) =>
  res.sendFile(path.join(__dirname, "/resources/public/images", req.params.name)))'''