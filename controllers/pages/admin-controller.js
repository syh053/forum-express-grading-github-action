const { Restaurant, Category } = require('../../db/models') // 載入 Restaurant、User、Category 物件
const adminServices = require('../../services/admin-services')

const adminController = {
  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants(req, (err, result) => err ? next(err) : res.render('admin/restaurants', result))
  },

  getRestaurant: (req, res, next) => {
    adminServices.getRestaurant(req, (err, result) => {
      if (err) throw new Error("Couldn't find any restaurant!!")

      res.render('admin/restaurant', { restaurant: result })
    })
  },

  createRestaurant: (req, res, next) => {
    Category.findAll({ raw: true })
      .then(categories => res.render('admin/create-restaurant', { categories }))
      .catch(err => next(err))
  },

  postRestaurant: (req, res, next) => {
    console.log(req.body)
    adminServices.postRestaurant(req, (err, result) => {
      if (err) return next(err)

      req.flash('success_messages', '新餐廳建立成功')
      req.session.createdData = result
      res.redirect('/admin/restaurants')
    })
  },

  editRestaurant: (req, res, next) => {
    return Promise.all([
      Restaurant.findByPk(req.params.id, {
        raw: true,
        nest: true,
        include: Category
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurant, categories]) => {
        if (!restaurant) throw Error("Couldn't find any restaurant!!")
        res.render('admin/edit-restaurant', { restaurant, categories })
      })
      .catch(err => {
        err.name = '編輯單筆餐廳'
        err.message = '資料庫查找錯誤!!'
        next(err)
      })
  },

  putRestaurant: (req, res, next) => {
    const { id } = req.params // 從路由提取動態 id

    adminServices.putRestaurant(req, (err, result) => {
      if (err) return next(err)

      req.flash('success_messages', 'restaurant edited successfully!!') // 在畫面顯示成功提示
      res.redirect(`/admin/restaurants/${id}`)// 導回餐廳頁
    })
  },

  deleteRestaurant: (req, res, next) => {
    adminServices.deleteRestaurant(req, (err, result) => {
      if (err) return next(err)

      req.flash('success_messages', 'Delete successfully!!')
      req.session.deletedData = result
      return res.redirect('/admin/restaurants')
    })
  },

  getUsers: (req, res, next) => {
    adminServices.getUsers(req, (err, result) => err ? next(err) : res.render('admin/users', { users: result }))
  },

  patchUser: (req, res, next) => {
    adminServices.patchUser(req, (err, result) => {
      if (err) return next(err)

      // 檢查使用者是不是 admin，若是的話禁止修改
      if (result.email === 'root@example.com') {
        req.flash('error_messages', '禁止變更 root 權限')
        return res.redirect('back')
      }

      req.flash('success_messages', '使用者權限變更成功') // 在畫面顯示成功提示
      return res.redirect('/admin/users')
    })
  }

}

module.exports = adminController
