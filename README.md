## Running Locally


Make sure you have [Node.js](http://nodejs.org/), [npm](https://www.npmjs.com/) and [Postgresql](https://www.postgresql.org) installed.

```sh
$ git clone https://github.com/Yonatan-n/cat-blag
$ cd cat-blag
$ npm install
$ node index.js
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Documentation

/home -> is the home page (or /)

/upload -> is an upload page form

/catPIC -> query the DB for all the cats

that's it for now.