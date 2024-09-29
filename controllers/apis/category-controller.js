const categoryServices = require('../../services/category-services')

const categoryController = {
  getCategories: (req, res, next) => {
    categoryServices.getCategories(req, (err, result) => err ? next(err) : res.json({ status: 'success', result }))
  },

  postCategory: (req, res, next) => {
    categoryServices.postCategory(req, (err, result) => err ? next(err) : res.json({ status: 'success', result }))
  },

  putCategory: (req, res, next) => {
    categoryServices.putCategory(req, (err, result) => err ? next(err) : res.json({ status: 'success', result }))
  },

  deleteCategory: (req, res, next) => {
    categoryServices.deleteCategory(req, (err, result) => err ? next(err) : res.json({ status: 'success', result }))
  }

}

module.exports = categoryController
