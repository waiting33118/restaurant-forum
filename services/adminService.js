// const imgur = require('imgur-node-api')

const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
// const User = db.User

const adminService = {
  getRestaurants: (req, res, callback) => {
    Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category],
      order: [['id', 'ASC']]
    })
      .then((restaurants) => callback(restaurants))
      .catch((error) => console.log(error))
  },
  getRestaurant: (req, res, callback) => {
    Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category]
    })
      .then((restaurant) => callback(restaurant))
      .catch((error) => console.log(error))
  },
  deleteRestaurant: (req, res, callback) => {
    Restaurant.findByPk(req.params.id)
      .then((restaurant) => restaurant.destroy())
      .then(() => callback({ status: 'success', message: '' }))
      .catch((error) => console.log(error))
  }
}

module.exports = adminService
