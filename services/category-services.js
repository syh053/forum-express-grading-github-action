const { Category } = require('../db/models')

const categoryServices = {
  getCategories: (req, cb) => {
    const { id } = req.params

    return Promise.all([
      Category.findAll({ raw: true }),
      id ? Category.findByPk(id, { raw: true }) : null
    ])
      .then(([categories, category]) => cb(null, { category, categories }))
      .catch(err => cb(err))
  },

  putCategory: (req, cb) => {
    const { id } = req.params
    const { name } = req.body

    if (!name) throw new Error('名稱不得為空!')

    return Category.findByPk(id)
      .then(category => {
        if (!category) throw new Error('分類不存在!')
        return category.update({ name })
      })
      .then(updateCategory => cb(null, { updateCategory }))
      .catch(err => cb(err))
  },

  postCategory: (req, cb) => {
    const { name } = req.body

    if (!name) throw new Error('請輸入名稱!')

    Category.create({ name })
      .then(newCategory => cb(null, { newCategory }))
      .catch(err => cb(err))
  },

  deleteCategory: (req, cb) => {
    const { id } = req.params

    Category.findByPk(id)
      .then(category => {
        if (!category) throw new Error('分類不存在!')

        return category.destroy()
      })
      .then(deleteCategory => cb(null, { deleteCategory }))
      .catch(err => cb(err))
  }

}

module.exports = categoryServices
