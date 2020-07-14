const categoryService = require('../../services/categoryService')

const categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (categories) =>
      res.json({ categories })
    )
  },
  postCategories: (req, res) => {
    categoryService.postCategories(req, res, result => res.json(result))
  },
  putCategories: (req, res) => {
    categoryService.putCategories(req, res, result => res.json(result))
  },
  deleteCategories: (req, res) => {
    categoryService.deleteCategories(req, res, result => res.json(result))
  }
}

module.exports = categoryController
