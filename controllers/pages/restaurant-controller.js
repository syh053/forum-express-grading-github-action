const restaurantServices = require('../../services/restaurant-services') // 載入 restaurantServices

const restaurantController = {
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, result) => err ? next(err) : res.render('restaurants', result))
  },

  getRestaurant: (req, res, next) => {
    restaurantServices.getRestaurant(req, (err, result) => err ? next(err) : res.render('restaurant', result))
  },

  getDashboard: (req, res, next) => {
    restaurantServices.getDashboard(req, (err, result) => err ? next(err) : res.render('dashboard', result))
  },

  getFeeds: (req, res, next) => {
    restaurantServices.getFeeds(req, (err, result) => err ? next(err) : res.render('feeds', result))
  },

  getTopRestaurants: (req, res, next) => {
    restaurantServices.getTopRestaurants(req, (err, result) => err ? next(err) : res.render('top-restaurants', result))
  }

}

module.exports = restaurantController
