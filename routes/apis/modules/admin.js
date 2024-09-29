const express = require('express')

const router = express.Router()

const upload = require('../../../middlewares/multer')

const adminController = require('../../../controllers/apis/admin-controller')

router.get('/restaurants', adminController.getRestaurants)

router.get('/restaurants/:id', adminController.getRestaurant)

router.post('/restaurants', upload.single('image'), adminController.postRestaurant)

router.delete('/restaurant/:id', adminController.deleteRestaurant)

module.exports = router
