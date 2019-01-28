const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')

const validExt = ['.txt', '.epub', '.mobi', '.pdf', '.doc', '.docx']

/* GET home page. */
router.get('/', function(req, res, next) {
  let files = fs.readdirSync(path.join(global.__rootdir, 'public', 'books'))

  files = files.filter(book => validExt.includes(path.extname(book)))

  const list = files.map(book => {
    return {
      name: path.basename(book),
      link: `/books/${encodeURIComponent(book)}`
    }
  })

  let data = {
    title: 'Kindle Share',
    books: list,
    prefix: process.env.STATIC_PREFIX
  }

  res.render('index', data);
});

module.exports = router;
