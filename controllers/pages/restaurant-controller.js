const { Restaurant, User, Category, Comment } = require('../../db/models') // 載入 Restaurant、User、Category、Comment 物件

const restaurantServices = require('../../services/restaurant-services') // 載入 restaurantServices

const { getUser } = require('../../helpers/auth-helpers') // 載入 getUser

const restaurantController = {
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, result) => err ? next(err) : res.render('restaurants', result))
  },

  getRestaurant: (req, res, next) => {
    restaurantServices.getRestaurant(req, (err, result) => err ? next(err) : res.render('restaurant', result))
  },

  getDashboard: (req, res, next) => {
    const { id } = req.params

    return Restaurant.findByPk(id, {
      // raw: true,
      // nest: true,
      include: [
        Category,
        Comment
      ]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant not found')

        return res.render('dashboard', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  },

  getFeeds: (req, res, next) => {
    restaurantServices.getFeeds(req, (err, result) => err ? next(err) : res.render('feeds', result))
  },

  getTopRestaurants: (req, res, next) => {
    const user = getUser(req)

    return Restaurant.findAll({
      include: [
        {
          model: User,
          as: 'FavoritedUsers'
        }
      ]
    })
      .then(restaurants => {
        const result = restaurants
          .map(restaurant => ({
            ...restaurant.toJSON(),
            description: restaurant.description?.length < 50
              ? restaurant.description
              : restaurant.description?.slice(0, 50) + '...',
            favoritedCount: restaurant.FavoritedUsers.length,
            isFavorited: user && user.FavoritedRestaurants.some(fr => fr.id === restaurant.id)
          }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount)
          .slice(0, 10)

        res.render('top-restaurants', { restaurants: result })
      })
      .catch(err => next(err))
  }

}

module.exports = restaurantController
