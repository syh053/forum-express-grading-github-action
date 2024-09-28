const { Restaurant, Favorite } = require('../db/models') // 載入 Restaurant, Favorite 物件

const { User } = require('../db/models') // 載入 User
const bcrypt = require('bcryptjs')

const userServices = {

  signUp: (req, cb) => {
    const { name, email, password, passwordCheck } = req.body
    // 建立正規表達式
    const regex = /@/g

    if (password !== passwordCheck) throw new Error('"Password Check" do not match "Password" !!')

    if (!regex.test(email)) throw new Error('"email must contain "@" !!')

    User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('This email is already exists!!')

        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(newUser => cb(null, newUser))
      .catch(err => cb(err)) // 錯誤處理
  },

  addFavorite: (req, cb) => {
    const { restaurantId } = req.params
    const userId = req.user.id

    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: { userId, restaurantId }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (favorite) throw new Error('You have favorited this restaurant!')

        return [Favorite.create({ restaurantId, userId }), restaurant]
      })
      .then(([create, restaurant]) => cb(null, restaurant))
      .catch(err => cb(err))
  },

  removeFavorite: (req, cb) => {
    const { restaurantId } = req.params
    const userId = req.user.id

    return Favorite.findOne({
      where: { userId, restaurantId }
    })
      .then(async favorite => {
        if (!favorite) throw new Error("You haven't favorited this restaurant")

        const restaurant = await Restaurant.findByPk(restaurantId, { raw: true })

        return [favorite.destroy(), restaurant]
      })
      .then(([destroy, restaurant]) => cb(null, restaurant))
      .catch(err => cb(err))
  }

}

module.exports = userServices
