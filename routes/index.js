const express = require('express')
const router = express.Router()

// 載入 admin-controller
const admin = require('./modules/admin')

// 載入 restaurant-controller
const restController = require('../controllers/restaurant-controller')

router.use('/admin', admin)

router.get('/restaurants', restController.getRestaurnats)

// 若匹配不到路由，最後進到從導向路由
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
