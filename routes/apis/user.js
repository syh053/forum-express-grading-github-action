const express = require('express')

const router = express.Router()

const userController = require('../../controllers/apis/user-controller') // 載入 user controller

const upload = require('../../middlewares/multer')

router.get('/:id', userController.getUser)

router.put('/:id', upload.single('image'), userController.putUser)

module.exports = router
