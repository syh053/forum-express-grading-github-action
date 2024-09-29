const express = require('express')

const router = express.Router()

const userController = require('../../controllers/apis/user-controller') // 載入 user controller

const upload = require('../../middlewares/multer')

router.get('/top', userController.getTopUsers) // 追蹤人數

router.get('/:id', userController.getUser)

router.put('/:id', upload.single('image'), userController.putUser)

module.exports = router
