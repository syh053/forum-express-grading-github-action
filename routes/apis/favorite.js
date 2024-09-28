const express = require('express') // 載入 express 套件
const router = express.Router() // 建立一個獨立的路由

const userController = require('../../controllers/apis/user-controller') // 載入 userController

router.post('/:restaurantId', userController.addFavorite)

router.delete('/:restaurantId', userController.removeFavorite)

module.exports = router
