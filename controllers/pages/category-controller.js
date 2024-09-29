const categoryServices = require('../../services/category-services')

const categoryController = {
  getCategories: (req, res, next) => {
    categoryServices.getCategories(req, (err, result) => {
      if (err) return next(err)

      res.render('admin/categories', result)
    })
  },

  postCategory: (req, res, next) => {
    categoryServices.postCategory(req, (err, result) => {
      if (err) return next(err)

      req.flash('success_messages', '分類建立成功')
      res.redirect('/admin/categories')
    })
  },

  putCategory: (req, res, next) => {
    categoryServices.putCategory(req, (err, result) => {
      if (err) return next(err)

      req.flash('success_messages', '分類修改成功')
      return res.redirect('/admin/categories')
    })
  },

  deleteCategory: (req, res, next) => {
    categoryServices.deleteCategory(req, (err, result) => {
      if (err) return next(err)

      req.flash('success_messages', '分類刪除成功!')
      res.redirect('/admin/categories')
    })
  }

}

module.exports = categoryController
