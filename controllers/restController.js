const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const restController = {
  getRestaurants: (req, res) => {
    Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      .then((restaurants) => {
        const data = restaurants.map((r) => ({
          ...r,
          description: r.description.substring(0, 50),
          categoryName: r.Category.name
        }))
        res.render('restaurants', { restaurants: data })
      })
      .catch((error) => console.log(error))
  },
  getRestaurant: (req, res) => {
    const { id } = req.params
    Restaurant.findByPk(id, {
      raw: true,
      nest: true,
      include: [Category]
    })
      .then((restaurant) => res.render('restaurant', { restaurant }))
      .catch((error) => console.log(error))
  }
}

module.exports = restController
