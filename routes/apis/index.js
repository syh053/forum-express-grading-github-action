const express = require('express')
const router = express.Router()

// 載入 restaurant-controller
const restController = require('../../controllers/apis/restaurant-controller')

const admin = require('../apis/modules/admin')

router.use('/admin', admin)

router.get('/restaurants', restController.getRestaurants)

module.exports = router
