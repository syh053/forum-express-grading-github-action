const { Restaurant, Category } = require('../db/models')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''

    return Promise.all([
      Restaurant.findAll({
        where: {
          ...categoryId ? { categoryId } : {} // 用三元運算子判斷 categoryId 是否存在，若存在傳入 { categoryId }，不存在傳入{}
        },
        raw: true,
        nest: true,
        include: Category
      }),
      Category.findAll({ raw: true })
    ])

      .then(([restaurants, categories]) => {
        const datas = restaurants.map(restaurant => {
          return {
            ...restaurant,
            description: restaurant.description.slice(0, 50)
          }
        })
        return res.render('restaurants', {
          restaurants: datas,
          categories,
          categoryId
        })
      })
      .catch(err => next(err))
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
