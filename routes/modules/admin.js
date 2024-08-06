const express = require('express')

const upload = require('../../middlewares/multer')

const router = express.Router()

const adminController = require('../../controllers/admin-controller')

router.get('/restaurants/create', adminController.createRestaurant)

router.get('/restaurants/:id/edit', adminController.editRestaurant)

router.get('/restaurants/:id', adminController.getRestaurant)

router.get('/restaurants', adminController.getRestaurants)

router.post('/restaurants', upload.single('image'), adminController.postRestaurant)

router.put('/restaurants/:id/edit', upload.single('image'), adminController.putRestaurant)

router.delete('/restaurants/:id', adminController.deleteRestaurant)

router.use('', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
