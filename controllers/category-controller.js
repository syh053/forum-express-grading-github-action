const { Category } = require('../db/models')

const categoryController = {
  getCategories: (req, res, next) => {
    Category.findAll({ raw: true })
      .then(categories => res.render('admin/categories', { categories }))
      .catch(err => next(err))
  },

  postCategory: (req, res, next) => {
    const { name } = req.body

    if (!name) throw new Error('請輸入名稱!')

    Category.create({ name })
      .then(() => {
        req.flash('success_messages', '分類建立成功')
        res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  }
}

module.exports = categoryController
