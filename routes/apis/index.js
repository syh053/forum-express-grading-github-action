const express = require('express')
const router = express.Router()

const userController = require('../../controllers/apis/user-controller') // 載入 userController

const restController = require('../../controllers/apis/restaurant-controller') // 載入 restaurant-controller

const commentController = require('../../controllers/apis/comment-controller') // 載入 commentController

// 載入 authenticated、authenticatedAdmin 狀態
const { localAuthenticated: localAuth, authenticated: auth, authenticatedAdmin: authAdmin } = require('../../middlewares/api-auth')

// 載入錯誤 message
const errMessage = require('../../middlewares/error-handler')

const admin = require('../apis/modules/admin')

router.use('/admin', auth, authAdmin, admin)

router.post('/signin', localAuth, userController.signIn)

router.post('/signup', userController.signUp)

router.get('/restaurants', auth, restController.getRestaurants)

router.post('/comments', auth, commentController.postComment)

router.use(errMessage.apiError)

module.exports = router
