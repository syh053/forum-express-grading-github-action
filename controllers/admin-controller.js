const { Restaurant } = require('../db/models')

const adminController = {
  getRestaurant: (req, res, next) => {
    Restaurant.findAll({ raw: true })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => {
        err.name = '資料庫'
        err.message = '資料庫錯誤!!'
        next(err)
      })
  }
}

module.exports = adminController
