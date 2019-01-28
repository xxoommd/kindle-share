const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')

const validExt = ['.txt', '.epub', '.mobi', '.pdf', '.doc', '.docx']

/* GET home page. */
router.get('/', function(req, res, next) {
  const prefix = process.env.STATIC_PREFIX
  let files = fs.readdirSync(path.join(global.__rootdir, 'public', 'books'))

  files = files.filter(book => validExt.includes(path.extname(book)))

  const list = files.map(book => {
    return {
      name: path.basename(book),
      link: `${prefix}/books/${encodeURIComponent(book)}`
    }
  })

  let data = {
    title: 'Kindle Share',
    books: list,
    prefix: prefix
  }

  res.render('index', data);
});

module.exports = router;
