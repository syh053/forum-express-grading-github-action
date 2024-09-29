const express = require('express')

const router = express.Router()

const userController = require('../../controllers/apis/user-controller')

router.post('/:restaurantId', userController.addLike) // 喜愛餐廳路由

router.delete('/:restaurantId', userController.removeLike) // 移除喜愛餐廳路由

module.exports = router
