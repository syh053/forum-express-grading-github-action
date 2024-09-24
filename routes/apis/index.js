const express = require('express')
const router = express.Router()

const passport = require('../../config/passport') // 載入設定好的 passport

const userController = require('../../controllers/apis/user-controller') // 載入 userController

// 載入 restaurant-controller
const restController = require('../../controllers/apis/restaurant-controller')

// 載入錯誤 message
const errMessage = require('../../middlewares/error-handler')

const admin = require('../apis/modules/admin')

router.use('/admin', admin)

router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)

router.get('/restaurants', restController.getRestaurants)

router.use(errMessage.apiError)

module.exports = router
