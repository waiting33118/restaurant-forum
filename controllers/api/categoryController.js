const categoryService = require('../../services/categoryService')

const categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (categories) =>
      res.json({ categories })
    )
  }
}

module.exports = categoryController
