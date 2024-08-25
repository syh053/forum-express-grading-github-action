const { Restaurant, Category } = require('../db/models')

const restaurantController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: Category
    })
      .then(restaurants => {
        const datas = restaurants.map(restaurant => {
          return {
            ...restaurant,
            description: restaurant.description.slice(0, 50)
          }
        })
        return res.render('restaurants', { restaurants: datas })
      })
  },

  getRestaurant: (req, res, next) => {
    const { id } = req.params

    Restaurant.findByPk(id, {
      // raw: true,
      // nest: true,
      include: Category
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant not found')

        return restaurant.increment('viewCounts')
      })
      .then(restaurant => res.render('restaurant', { restaurant: restaurant.toJSON() }))
      .catch(err => next(err))
  },

  getDashboard: (req, res, next) => {
    const { id } = req.params

    return Restaurant.findByPk(id, {
      raw: true,
      nest: true,
      include: Category
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant not found')

        return res.render('dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
