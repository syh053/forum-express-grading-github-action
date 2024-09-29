const express = require('express')

const router = express.Router()

const upload = require('../../../middlewares/multer')

const adminController = require('../../../controllers/apis/admin-controller')

const categoryController = require('../../../controllers/apis/category-controller')

router.get('/restaurants', adminController.getRestaurants)

router.get('/restaurants/:id', adminController.getRestaurant)

router.post('/restaurants', upload.single('image'), adminController.postRestaurant)

router.delete('/restaurant/:id', adminController.deleteRestaurant)

router.patch('/users/:id', adminController.patchUser) // 變更使用者權限路由

router.get('/users', adminController.getUsers) // 後台使用者頁面路由

router.get('/categories/:id/edit', categoryController.getCategories) // 後台理餐廳分類列表

router.put('/categories/:id/edit', categoryController.putCategory) // 後台餐廳分類修改

router.post('/categories', categoryController.postCategory) // 後台建立新的餐廳分類

router.delete('/categories/:id', categoryController.deleteCategory) // 後台餐廳分類刪除

module.exports = router
