const express = require('express')

const router = express.Router()

const adminController = require('../../controllers/admin-controller')

// 載入 authenticatedAdmin 狀態
const { authenticatedAdmin: authAdmin } = require('../../middlewares/auth')

router.get('/restaurants', authAdmin, adminController.getRestaurant)

router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
