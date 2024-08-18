const { Category } = require('../db/models')

const categoryController = {
  getCategories: (req, res, next) => {
    Category.findAll({ raw: true })
      .then(categories => res.render('admin/categories', { categories }))
      .catch(err => next(err))
  }
}

module.exports = categoryController
