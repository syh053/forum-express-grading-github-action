const restaurantServices = require('../../services/restaurant-services') // 載入 restaurantServices

const restaurantController = {
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, result) => err ? next(err) : res.json({ status: 'success', result }))
  }
}

module.exports = restaurantController
