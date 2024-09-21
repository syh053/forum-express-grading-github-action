const { Restaurant, User, Category, Comment } = require('../../db/models') // 載入 Restaurant、User、Category、Comment 物件

const restaurantServices = require('../../services/restaurant-services') // 載入 restaurantServices

const { getUser } = require('../../helpers/auth-helpers') // 載入 getUser

const restaurantController = {
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, result) => err ? next(err) : res.render('restaurants', result))
  },

  getRestaurant: (req, res, next) => {
    const { id } = req.params

    return Restaurant.findByPk(id, {
      include: [
        Category,
        {
          model: Comment,
          include: User,
          separate: true,
          order: [['createdAt', 'DESC']]
        },
        {
          model: User,
          as: 'FavoritedUsers'
        },
        {
          model: User,
          as: 'LikeUsers'
        }
      ]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant not found')

        return restaurant.increment('viewCounts')
      })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.some(fs => fs.id === req.user.id)
        const isLiked = restaurant.LikeUsers.some(ls => ls.id === req.user.id)

        return res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited,
          isLiked
        })
      })
      .catch(err => next(err))
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
    Promise.all([
      Restaurant.findAll({
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: Category,
        limit: 4
      }),
      Comment.findAll({
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant],
        limit: 10
      })
    ])
      .then(([restaurants, comments]) => {
        const datas = restaurants.map(restaurant => (
          {
            ...restaurant,
            description: restaurant.description.length < 50
              ? restaurant.description
              : restaurant.description.slice(0, 50) + '...'
          }
        ))

        res.render('feeds', { restaurants: datas, comments })
      })
      .catch(err => next(err))
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
            description: restaurant.description.length < 50
              ? restaurant.description
              : restaurant.description.slice(0, 50) + '...',
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
