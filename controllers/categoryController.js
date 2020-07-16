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
    categoryService.getCategory(req, res, category => res.render('admin/categories', { category }))
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
    categoryService.deleteCategories(req, res, result => res.redirect('/admin/categories'))
  }
}

module.exports = categoryController
