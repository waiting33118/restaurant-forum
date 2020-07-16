const categoryService = require('../../services/categoryService')

const categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (categories) =>
      res.json({ categories })
    )
  },
  getCategory: (req, res) => {
    categoryService.getCategory(req, res, category => res.json({ category }))
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
