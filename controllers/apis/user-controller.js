const jwt = require('jsonwebtoken')

const userServices = require('../../services/user-services') // 載入 userServices

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },

  signUp: (req, res, next) => {
    userServices.signUp(req, (err, result) => err ? next(err) : res.json({ status: 'success', result }))
  },

  getUser: (req, res, next) => {
    userServices.getUser(req, (err, result) => err ? next(err) : res.json({ status: 'success', result }))
  },

  putUser: (req, res, next) => {
    userServices.putUser(req, (err, result) => err ? next(err) : res.json({ status: 'success', result }))
  },

  addFavorite: (req, res, next) => {
    userServices.addFavorite(req, (err, result) => err ? next(err) : res.json({ status: 'success', result }))
  },

  removeFavorite: (req, res, next) => {
    userServices.removeFavorite(req, (err, result) => err ? next(err) : res.json({ status: 'success', result }))
  },

  addLike: (req, res, next) => {
    userServices.addLike(req, (err, result) => err ? next(err) : res.json({ status: 'success', result }))
  },

  addFollowing: (req, res, next) => {
    userServices.addFollowing(req, (err, result) => err ? next(err) : res.json({ status: 'success', result }))
  },

  removeLike: (req, res, next) => {
    userServices.removeLike(req, (err, result) => err ? next(err) : res.json({ status: 'success', result }))
  },

  getTopUsers: (req, res, next) => {
    userServices.getTopUsers(req, (err, result) => err ? next(err) : res.json({ status: 'success', result }))
  },

  removeFollowing: (req, res, next) => {
    userServices.removeFollowing(req, (err, result) => err ? next(err) : res.json({ status: 'success', result }))
  }

}

module.exports = userController
