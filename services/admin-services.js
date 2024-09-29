const { Restaurant, Category } = require('../db/models') // 載入 Restaurant、User、Category 物件

const { getOffset, getPagination } = require('../helpers/pagination-helper') // 載入 pagination-helper

const localFileHandler = require('../helpers/file-helpers') // 載入 file-helper

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

  getRestaurant: (req, cb) => {
    return Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: Category
    })
      .then(restaurant => {
        if (!restaurant) throw Error("Couldn't find any restaurant!!")
        return cb(null, restaurant)
      })
      .catch(err => cb(err))
  },

  postRestaurant: (req, cb) => {
    console.log(req.body)
    const { name, categoryId, tel, address, openingHours, description } = req.body

    if (!name) throw new Error('Missing name!!')
    if (!categoryId) throw new Error('Missing categoryId!!')

    const { file } = req // 把檔案取出來，也可以寫成 const file = req.file

    return localFileHandler(file) // 把取出的檔案傳給 file-helper 處理後
      .then(filePath => Restaurant.create({
        name,
        categoryId,
        tel,
        address,
        openingHours,
        description,
        image: filePath
      }))
      .then(newRestaurant => cb(null, { restaurant: newRestaurant }))
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
