const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const restController = {
  getRestaurants: (req, res) => {
    const whereQuery = {}
    let { categoryId } = req.query
    if (categoryId) {
      categoryId = Number(categoryId)
      whereQuery.CategoryId = categoryId
    }
    Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category],
      where: whereQuery
    })
      .then((restaurants) => {
        const data = restaurants.map((r) => ({
          ...r,
          description: r.description.substring(0, 50),
          categoryName: r.Category.name
        }))
        Category.findAll({ raw: true, nest: true })
          .then((categories) =>
            res.render('restaurants', {
              restaurants: data,
              categories,
              categoryId
            })
          )
          .catch((error) => console.log(error))
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
