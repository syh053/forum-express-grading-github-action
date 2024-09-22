const { Restaurant, Category } = require('../db/models') // 載入 Restaurant、User、Category 物件

const { getOffset, getPagination } = require('../helpers/pagination-helper') // 載入 pagination-helper

const adminServices = {
  getRestaurants: (req, cb) => {
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const DEFAULT_LIMIT = 10
    const offset = getOffset(page, DEFAULT_LIMIT)
    const limit = Number(req.query.limit) || DEFAULT_LIMIT

    Promise.all([
      Restaurant.findAndCountAll({
        where: { ...categoryId ? { categoryId } : {} },
        offset,
        limit,
        raw: true,
        nest: true,
        include: Category
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => cb(null, {
        restaurants: restaurants.rows,
        categories,
        categoryId,
        pagination: getPagination(limit, page, restaurants.count)
      }))
      .catch(err => cb(err))
  },

  deleteRestaurant: (req, cb) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (restaurant === null) throw new Error("Couldn't delete any restaurant!!")
        return restaurant.destroy()
      })
      .then(deleteRsetaurant => cb(null, { restaurant: deleteRsetaurant }))
      .catch(err => cb(err))
  }

}

module.exports = adminServices
