const { Restaurant, User, Category, Comment } = require('../db/models')
// 載入分頁 helper
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const page = Number(req.query.page) || 1
    const categoryId = Number(req.query.categoryId) || ''

    const DEFAULT_LIMIT = 9 // 指定 limit 為 9，避免 magic number!!
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(page, DEFAULT_LIMIT)

    return Promise.all([
      Restaurant.findAndCountAll({
        where: {
          ...categoryId ? { categoryId } : {} // 用三元運算子判斷 categoryId 是否存在，若存在傳入 { categoryId }，不存在傳入{}
        },
        offset,
        limit,
        raw: true,
        nest: true,
        include: Category
      }),
      Category.findAll({ raw: true })
    ])

      .then(([restaurants, categories]) => {
        const favoritedRestaurants = req.user && req.user.FavoritedRestaurants.map(restaurants => restaurants.id)

        const datas = restaurants.rows.map(restaurant => {
          return {
            ...restaurant,
            description: restaurant.description.slice(0, 50),
            isFavorited: favoritedRestaurants.includes(restaurant.id)
          }
        })
        return res.render('restaurants', {
          restaurants: datas,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count) // 傳入分頁參數
        })
      })
      .catch(err => next(err))
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
        }
      ]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant not found')

        return restaurant.increment('viewCounts')
      })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.some(fs => fs.id === req.user.id)

        return res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited
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
  }
}

module.exports = restaurantController
