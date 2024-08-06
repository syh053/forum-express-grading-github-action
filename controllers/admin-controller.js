const { Restaurant } = require('../db/models')
const localFileHandler = require('../helpers/file-helpers') // 載入 file-helper

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

    const { file } = req // 把檔案取出來，也可以寫成 const file = req.file

    Promise.all([ // 非同步處理
      Restaurant.findByPk(req.params.id), // 去資料庫查有沒有這間餐廳
      localFileHandler(file)
    ])

      .then(([restaurant, file]) => {
        if (!restaurant) throw Error("Couldn't find any restaurant!!")

        return restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description,
          image: file || restaurant.image // 如果 filePath 是 Truthy (使用者有上傳新照片) 就用 filePath，是 Falsy (使用者沒有上傳新照片) 就沿用原本資料庫內的值
        })
      })
      .then(() => {
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

    const { file } = req // 把檔案取出來，也可以寫成 const file = req.file

    localFileHandler(file) // 把取出的檔案傳給 file-helper 處理後
      .then(filePath => Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath
      }))
      .then(() => {
        req.flash('success_msg', 'restaurant created successfully!!') // 在畫面顯示成功提示
        res.redirect('/admin/restaurants') // 新增完成後導回後台首頁
      })
      .catch(err => {
        err.name = 'createError'
        err.message = 'created fail!!'
        next(err)
      })
  },

  deleteRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        console.log(restaurant === null)
        if (restaurant === null) throw new Error("Couldn't delete any restaurant!!")
        return restaurant.destroy()
      })
      .then(() => {
        req.flash('success_msg', 'Delete successfully!!')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
