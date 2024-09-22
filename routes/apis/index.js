const express = require('express')
const router = express.Router()

// 載入 restaurant-controller
const restController = require('../../controllers/apis/restaurant-controller')

// 載入錯誤 message
const errMessage = require('../../middlewares/error-handler')

const admin = require('../apis/modules/admin')

router.use('/admin', admin)

router.get('/restaurants', restController.getRestaurants)

router.use(errMessage.apiError)

module.exports = router
