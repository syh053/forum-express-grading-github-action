const { Restaurant } = require('../db/models')

const adminController = {
  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { raw: true })
      .then(restaurant => {
        if (!restaurant) throw Error("Couldn't find any restaurant!!")
        res.render('admin/restaurant', { restaurant })
      })
      .catch(err => {
        err.name = '搜尋單筆餐廳'
        err.message = '資料庫查找錯誤!!'
        next(err)
      })
  },

  editRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { raw: true })
      .then(restaurant => {
        if (!restaurant) throw Error("Couldn't find any restaurant!!")
        res.render('admin/edit-restaurant', { restaurant })
      })
      .catch(err => {
        err.name = '編輯單筆餐廳'
        err.message = '資料庫查找錯誤!!'
        next(err)
      })
  },

  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Missing name!!')

    Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw Error("Couldn't find any restaurant!!")

        return restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description
        })
      })
      .then(restaurnat => {
        req.flash('success_msg', 'restaurant edited successfully!!') // 在畫面顯示成功提示
        res.redirect('/admin/restaurants')
      })
      .catch(err => {
        err.name = 'editeError'
        err.message = 'edited fail!!'
        next(err)
      })
  },

  getRestaurants: (req, res, next) => {
    Restaurant.findAll({ raw: true })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => {
        err.name = '全部餐廳搜尋'
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
