## Running Locally


Make sure you have [Node.js](http://nodejs.org/), [npm](https://www.npmjs.com/) And [Postgresql](https://www.postgresql.org) installed, Also, you need to have your own AWS credentials, and a [S3 Bucket](https://aws.amazon.com/s3/).
```sh
$ git clone https://github.com/Yonatan-n/cat-blag
$ cd cat-blag
$ npm install
$ node index.js
```

Before you run you app Locally you need to create a .env file and populate it as described:
```
accessKeyId: 'your-AWS-id'
secretAccessKey: 'your-AWS-access-key'
DATABASE_URL: 'postgres://[User]:[Password]@[Host]:[Port]/[Database]'
formPassword: 'somePassword'
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku (also make a .env file with the credentials)

```
$ heroku create
$ git push heroku master
$ heroku open
```
or

[![Deploy
## Documentation

/home -> is the home page (or /)
/upload -> is an upload page form
/home#edit -> show an "Edit" button on the cats cards so you can edit them
/api/color/"COLOR" -> get Array of JSON of cats of the same color (Ginger)
/api/tags/"TAG" -> get Array of JSON of cats of the same tag (Kitten)
/api/name/"NAME" -> get Array of JSON of cats of the same name (Mastick)

