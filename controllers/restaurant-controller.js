const { Restaurant, Category } = require('../db/models')

const restaurantController = {
  getRestaurnats: (req, res) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: Category
    })
      .then(restaurants => {
        const datas = restaurants.map(restaurant => {
          return {
            ...restaurant,
            description: restaurant.description.slice(0, 50)
          }
        })
        return res.render('restaurants', { restaurants: datas })
      })
  }
}

module.exports = restaurantController
