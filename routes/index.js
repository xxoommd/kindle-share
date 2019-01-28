const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

const validExt = ['.txt', '.epub', '.mobi', '.pdf', '.doc', '.docx']

function formatFileSize(bytes) {
    if (bytes >= 1024) {
        let kb = bytes / 1024
        if (kb >= 1024) {
            let mb = kb / 1024
            if (mb >= 1024) {
                let gb = mb / 1024
                return `${gb.toFixed(2)} GB`
            } else {
                return `${mb.toFixed(2)} MB`
            }
        } else {
            return `${kb.toFixed(1)} KB`
        }
    } else {
        return `${bytes} Bytes`
    }
}

function getFileSize(filename) {
  const stats = fs.statSync(filename)
  const fileSizeInBytes = stats["size"]
  return formatFileSize(fileSizeInBytes)
}

/* GET home page. */
router.get('/', function(req, res) {
  let files = fs.readdirSync(global.__bookdir)

  files = files.filter(book => validExt.includes(path.extname(book)))

  const list = files.map(book => {
    return {
      name: path.basename(book),
      type: path.extname(book),
      size: getFileSize(path.join(global.__bookdir, book)),
      link: `books/${encodeURIComponent(book)}`
    }
  })

  let data = {
    title: 'Kindle Share',
    books: list
  }

  res.render('index', data);
});

router.post('/upload', (req, res) => {
  console.log('req.body: ', req.body)
  console.log('req.files: ', req.files)
  let file = req.files.upload_file
  if (!file) {
    res.redirect('/')
    return
  }

  let rename
  if (req.body.upload_name.length > 0) {
    rename = req.body.upload_name + path.extname(file.name)
  } else {
    rename = file.name
  }

  console.log('--- rename to:', rename)
  let newpath = path.join(global.__bookdir, rename)
  console.log('--- newpath to:', newpath)
  file.mv(newpath, err => {
    if (err) {
      console.error('move file failed:', err.message)
    }
  })

  res.redirect('.')
})

module.exports = router;
