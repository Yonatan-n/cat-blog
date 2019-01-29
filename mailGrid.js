// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
  to: 'yonatan.n@protonmail.com',
  from: 'cat-blag@cats.com',
  subject: 'Welcome to my blog folks',
  text: 'Sit yo\' ass down, and get ready for some cute fluffy cats!'
  // html: '<strong>and easy to do anywhere, even with Node.js</strong>'
}
sgMail.send(msg, function (err, data) {
  if (err) throw err
  console.log(data)
})
//  n2M9xq52jgdJw936 sendGrid
