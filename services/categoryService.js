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
  },
  getCategory: (req, res, callback) => {
    Category.findByPk(req.params.id, { raw: true })
      .then((category) => callback(category))
      .catch((error) => console.log(error))
  },
  postCategories: (req, res, callback) => {
    const { name } = req.body
    if (!name) {
      callback({ status: 'error', message: '餐廳種類欄位不得為空白！' })
    } else {
      Category.create({ name })
        .then((category) => callback({ status: 'success', message: `成功建立"${category.name}"種類` }))
        .catch((error) => console.log(error))
    }
  },
  putCategories: (req, res, callback) => {
    const { name } = req.body
    if (!name) {
      callback({ status: 'error', message: '餐廳種類欄位不得為空白！' })
    } else {
      Category.findByPk(req.params.id)
        .then((category) => category.update({ name }))
        .then(() => callback({ status: 'success', message: '餐廳種類更新成功！' }))
        .catch((error) => console.log(error))
    }
  },
  deleteCategories: (req, res, callback) => {
    Category.findByPk(req.params.id)
      .then((category) => category.destroy())
      .then(() => callback({ status: 'success', message: '' }))
      .catch((error) => console.log(error))
  }
}

module.exports = categoryService
