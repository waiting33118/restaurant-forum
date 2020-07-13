const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category

const adminController = {
  getRestaurants: (req, res) => {
    Restaurant.findAll({
      include: [Category],
      order: [['id', 'ASC']]
    })
      .then((restaurants) => res.json({ restaurants }))
      .catch((error) => console.log(error))
  }
}

module.exports = adminController
