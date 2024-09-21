const { Restaurant, Category } = require('../../db/models') // 載入 Restaurant、User、Category、Comment 物件

const { getOffset, getPagination } = require('../../helpers/pagination-helper') // 載入分頁 helper

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
        // 用可選串連運算子避免 null 或 undefined 引發的錯誤，等價於下一句方法
        const favoritedRestaurants = req.user?.FavoritedRestaurants ? req.user.FavoritedRestaurants.map(restaurants => restaurants.id) : []
        // 用 && 短路求值設計避免 null 或 undefined 引發的錯誤，等價於上一句方法
        const likedRestaurants = req.user && req.user.LikeRestaurants ? req.user.LikeRestaurants.map(restaurant => restaurant.id) : []

        const datas = restaurants.rows.map(restaurant => {
          return {
            ...restaurant,
            description: restaurant.description.slice(0, 50),
            isFavorited: favoritedRestaurants.includes(restaurant.id),
            isLiked: likedRestaurants.includes(restaurant.id)
          }
        })
        return res.json({
          restaurants: datas,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count) // 傳入分頁參數
        })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
