const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: (req, res) => {
    const { id } = req.params
    Category.findAll({ raw: true, nest: true, order: [['id', 'ASC']] })
      .then((categories) => {
        if (id) {
          Category.findByPk(id, { raw: true })
            .then((category) =>
              res.render('admin/categories', { categories, category })
            )
            .catch((error) => console.log(error))
        } else {
          res.render('admin/categories', { categories })
        }
      })
      .catch((error) => console.log(error))
  },
  postCategories: (req, res) => {
    const { name } = req.body
    if (!name) {
      req.flash('error_messages', '餐廳種類欄位不得為空白！')
      res.redirect('back')
    } else {
      Category.create({ name })
        .then(() => res.redirect('/admin/categories'))
        .catch((error) => console.log(error))
    }
  },
  putCategories: (req, res) => {
    const { name } = req.body
    const { id } = req.params
    if (!name) {
      req.flash('error_messages', '餐廳種類欄位不得為空白！')
      res.redirect('back')
    } else {
      Category.findByPk(id)
        .then((category) => category.update({ name }))
        .then(() => res.redirect('/admin/categories'))
        .catch((error) => console.log(error))
    }
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
