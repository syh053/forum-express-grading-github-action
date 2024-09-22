const adminServices = require('../../services/admin-services')

const adminController = {
  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants(req, (err, result) => err ? next(err) : res.json({ status: 'success', result }))
  },

  deleteRestaurant: (req, res, next) => {
    adminServices.deleteRestaurant(req, (err, result) => err ? next(err) : res.json({ status: 'success', result }))
  }
}

module.exports = adminController
