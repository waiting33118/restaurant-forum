const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: (req, res) => {
    Category.findAll({ raw: true, nest: true }).then((categories) => {
      res.render('admin/categories', { categories })
    })
  },
  postCategories: (req, res) => {
    const { name } = req.body
    if (!name) {
      req.flash('error_messages', '新增餐廳種類欄位不得為空白！')
      res.redirect('back')
    } else {
      Category.create({
        name
      })
        .then(() => {
          res.redirect('/admin/categories')
        })
        .catch((error) => console.log(error))
    }
  }
}

module.exports = categoryController
