const express = require('express')

const router = express.Router()

const upload = require('../../../middlewares/multer')

const adminController = require('../../../controllers/apis/admin-controller')

router.get('/restaurants', adminController.getRestaurants)

router.get('/restaurants/:id', adminController.getRestaurant)

router.post('/restaurants', upload.single('image'), adminController.postRestaurant)

router.delete('/restaurant/:id', adminController.deleteRestaurant)

router.patch('/users/:id', adminController.patchUser) // 變更使用者權限路由

router.get('/users', adminController.getUsers) // 後台使用者頁面路由

module.exports = router
