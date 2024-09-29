const adminServices = require('../../services/admin-services')

const adminController = {
  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants(req, (err, result) => err ? next(err) : res.json({ status: 'success', result }))
  },

  getRestaurant: (req, res, next) => {
    adminServices.getRestaurant(req, (err, result) => err ? next(err) : res.json({ status: 'success', result }))
  },

  postRestaurant: (req, res, next) => {
    adminServices.postRestaurant(req, (err, result) => err ? next(err) : res.json({ status: 'success', result }))
  },

  deleteRestaurant: (req, res, next) => {
    adminServices.deleteRestaurant(req, (err, result) => err ? next(err) : res.json({ status: 'success', result }))
  },

  getUsers: (req, res, next) => {
    adminServices.getUsers(req, (err, result) => err ? next(err) : res.json({ status: 'success', result }))
  },

  patchUser: (req, res, next) => {
    adminServices.patchUser(req, (err, result) => {
      if (err) return next(err)

      if (result.email === 'root@example.com') throw new Error('禁止變更 root 權限')

      return res.json({ status: 'success', result })
    })
  }

}

module.exports = adminController
