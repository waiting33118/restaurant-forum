const db = require('../models')
const Category = db.Category

const categoryService = {
  getCategories: (req, res, callback) => {
    Category.findAll({
      raw: true,
      nest: true,
      order: [['id', 'ASC']]
    })
      .then((categories) => callback(categories))
      .catch((error) => console.log(error))
  }
}

module.exports = categoryService
