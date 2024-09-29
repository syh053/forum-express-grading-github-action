const express = require('express')
const router = express.Router()

const user = require('../apis/user') // 載入 user 路由

const favorite = require('../apis/favorite') // 載入 favorite 路由

const like = require('../apis/like') // 載入 favorite 路由

const userController = require('../../controllers/apis/user-controller') // 載入 userController

const restController = require('../../controllers/apis/restaurant-controller') // 載入 restaurant-controller

const commentController = require('../../controllers/apis/comment-controller') // 載入 commentController

// 載入 authenticated、authenticatedAdmin 狀態
const { localAuthenticated: localAuth, authenticated: auth, authenticatedAdmin: authAdmin } = require('../../middlewares/api-auth')

// 載入錯誤 message
const errMessage = require('../../middlewares/error-handler')

const admin = require('../apis/modules/admin')

router.use('/admin', auth, authAdmin, admin)

router.use('/user', auth, user) // favorite 路由

router.use('/favorite', auth, favorite) // favorite 路由

router.use('/like', auth, like) // like 路由

router.post('/signin', localAuth, userController.signIn)

router.post('/signup', userController.signUp)

router.post('/following/:userId', auth, userController.addFollowing) // 追蹤使用者

router.delete('/following/:userId', auth, userController.removeFollowing) // 刪除追蹤

router.get('/restaurants', auth, restController.getRestaurants)

router.get('/restaurants/top', auth, restController.getTopRestaurants) // 查看前10名被收藏的餐廳訊息

router.get('/restaurants/:id', auth, restController.getRestaurant) // 查看單筆餐廳訊息

router.get('/restaurants/:id/dashboard', auth, restController.getDashboard) // 查看單筆餐廳活動數據

router.get('/restaurants/feeds', auth, restController.getFeeds) // 查看最新 10 比餐廳、評論路由

router.post('/comments', auth, commentController.postComment)

router.delete('/comments/:id', auth, authAdmin, commentController.deleteComment) // 刪除評論路由

router.use(errMessage.apiError)

module.exports = router
