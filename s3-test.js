const AWS = require("aws-sdk")
const fs = require('fs')
const awsConfig = {
    "region": "us-east-1",
    "accessKeyId": "AKIAJ7A2XOBNLOKRZ6MA",
    "secretAccessKey":"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"
}
AWS.config.update(awsConfig)

const s3 = new AWS.S3

const filePath = `./nodeFizzBuzz.js`
const params = {
    Bucket: 'cat-blag-bucket',
    Body: fs.createReadStream(filePath),
    Key: `folder/${(new Date().toDateString)}`
}

s3.upload(params, (err, data) => {
    if (err) throw err
    console.log(`uploded in ${data.location}`)
})