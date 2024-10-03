const fs = require('fs')
const path = require('path')

const dirPath = path.join(__dirname, '..', 'upload') // 定義 temp 檔案路徑

// 檢查 temp 資料夾是否存在，若不存在則建立 temp 資料夾
if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath)

const localFileHandler = file => { // file 是 multer 處理完的檔案
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)

    const fileName = `upload/${file.originalname}`
    return fs.promises.readFile(file.path)
      .then(path => fs.promises.writeFile(fileName, path))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}

module.exports = localFileHandler
