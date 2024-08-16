const { Restaurant, User, Category } = require('../db/models')
const localFileHandler = require('../helpers/file-helpers') // 載入 file-helper

const adminController = {
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: Category
    })
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
    return Restaurant.findByPk(req.params.id, { raw: true })
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

    return Promise.all([ // 非同步處理
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
        req.flash('success_messages', 'restaurant edited successfully!!') // 在畫面顯示成功提示
        res.redirect('/admin/restaurants')
      })
      .catch(err => {
        err.name = 'editeError'
        err.message = 'edited fail!!'
        next(err)
      })
  },

  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: Category
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => {
        err.name = '全部餐廳搜尋'
        err.message = '資料庫錯誤!!'
        next(err)
      })
  },

  getUsers: (req, res, next) => {
    return User.findAll({ raw: true })
      .then(users => {
        res.render('admin/users', { users })
      })
      .catch(err => {
        err.name = '全部使用者搜尋'
        err.message = '資料庫錯誤!!'
        next(err)
      })
  },

  createRestaurant: (req, res) => res.render('admin/create-restaurant'),

  postRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body

    if (!name) throw new Error('Missing name!!')

    const { file } = req // 把檔案取出來，也可以寫成 const file = req.file

    return localFileHandler(file) // 把取出的檔案傳給 file-helper 處理後
      .then(filePath => Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath
      }))
      .then(() => {
        req.flash('success_messages', 'restaurant created successfully!!') // 在畫面顯示成功提示
        res.redirect('/admin/restaurants') // 新增完成後導回後台首頁
      })
      .catch(err => {
        err.name = 'createError'
        err.message = 'created fail!!'
        next(err)
      })
  },

  patchUser: (req, res, next) => {
    const { id } = req.params
    return User.findByPk(id)
      .then(user => {
        if (!user) throw new Error("Couldn't find any user!!")
        if (user.name === 'root') {
          req.flash('error_messages', '禁止變更 root 權限')
          return res.redirect('back')
        }
        return user.update({
          isAdmin: !user.isAdmin
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者權限變更成功') // 在畫面顯示成功提示
        return res.redirect('/admin/users')
      })
      .catch(err => next(err))
  },

  deleteRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        console.log(restaurant === null)
        if (restaurant === null) throw new Error("Couldn't delete any restaurant!!")
        return restaurant.destroy()
      })
      .then(() => {
        req.flash('success_messages', 'Delete successfully!!')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
