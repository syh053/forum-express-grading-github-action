const { Restaurant } = require('../db/models')

const adminController = {
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { raw: true })
      .then(restaurant => {
        if (!restaurant) throw Error("Couldn't find any restaurant!!")
        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => {
        err.name = '資料庫'
        err.message = '資料庫查找錯誤!!'
        next(err)
      })
  },

  getRestaurants: (req, res, next) => {
    Restaurant.findAll({ raw: true })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => {
        err.name = '資料庫'
        err.message = '資料庫錯誤!!'
        next(err)
      })
  },

  createRestaurant: (req, res) => res.render('admin/create-restaurant'),

  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body

    if (!name) throw new Error('Missing name!!')

    Restaurant.create({
      name,
      tel,
      address,
      openingHours,
      description
    })
      .then(() => {
        req.flash('success_msg', 'restaurant created successfully!!') // 在畫面顯示成功提示
        res.redirect('/admin/restaurants') // 新增完成後導回後台首頁
      })
      .catch(err => {
        err.name = 'createError'
        err.message = 'created fail!!'
        next(err)
      })
  }
}

module.exports = adminController
