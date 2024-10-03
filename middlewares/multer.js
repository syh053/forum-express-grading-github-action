const multer = require('multer')

const fs = require('fs')
const path = require('path')

const dirPath = path.join(__dirname, '..', 'temp')

// 檢查資料夾是否存在，若不存在則建立資料夾
if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath)

const upload = multer({ dest: 'temp/' })

module.exports = upload
