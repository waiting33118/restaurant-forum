const db = require('../models')
const Category = db.Category

const categoryService = require('../services/categoryService')

const categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (categories) =>
      res.render('admin/categories', { categories })
    )
  },
  getCategory: (req, res) => {
    Category.findByPk(req.params.id, { raw: true })
      .then((category) => res.render('admin/categories', { category }))
      .catch((error) => console.log(error))
  },
  postCategories: (req, res) => {
    categoryService.postCategories(req, res, result => {
      if (result.status === 'error') {
        req.flash('error_messages', result.message)
        return res.redirect('back')
      }
      req.flash('success_messages', result.message)
      res.redirect('/admin/categories')
    })
  },
  putCategories: (req, res) => {
    categoryService.putCategories(req, res, result => {
      if (result.status === 'error') {
        req.flash('error_messages', result.message)
        return res.redirect('back')
      }
      req.flash('success_messages', result.message)
      res.redirect('/admin/categories')
    })
  },
  deleteCategories: (req, res) => {
    const { id } = req.params
    Category.findByPk(id)
      .then((category) => category.destroy())
      .then(() => res.redirect('/admin/categories'))
      .catch((error) => console.log(error))
  }
}

module.exports = categoryController
