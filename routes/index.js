const express = require('express')
const router = express.Router()

// 載入 admin-controller
const admin = require('./modules/admin')

// 載入 restaurant-controller
const restController = require('../controllers/restaurant-controller')

// 載入 user-controller
const userController = require('../controllers/user-controller')

router.use('/admin', admin)

router.get('/restaurants', restController.getRestaurnats)

router.get('/signup', userController.signUpPage)

router.post('/signup', userController.signUp)

router.get('/signin', (req, res) => res.send('create successed'))

// 若匹配不到路由，最後進到從導向路由
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
