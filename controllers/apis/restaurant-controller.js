const restaurantServices = require('../../services/restaurant-services') // 載入 restaurantServices

const restaurantController = {
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, result) => err ? next(err) : res.json({ status: 'success', result }))
  },

  getRestaurant: (req, res, next) => {
    restaurantServices.getRestaurant(req, (err, result) => err ? next(err) : res.json({ status: 'success', result }))
  },

  getDashboard: (req, res, next) => {
    restaurantServices.getDashboard(req, (err, result) => err ? next(err) : res.json({ status: 'success', result }))
  },

  getFeeds: (req, res, next) => {
    restaurantServices.getFeeds(req, (err, result) => err ? next(err) : res.json({ status: 'success', result }))
  }

}

module.exports = restaurantController
