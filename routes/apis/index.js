const express = require('express')
const router = express.Router()

// 載入 restaurant-controller
const restController = require('../../controllers/apis/restaurant-controller')

router.get('/restaurants', restController.getRestaurants)

module.exports = router
