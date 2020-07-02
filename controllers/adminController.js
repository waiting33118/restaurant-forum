const db = require('../models')
const Restaurant = db.Restaurant

const adminController = {
  getRestaurants: (req, res) => {
    Restaurant.findAll({ raw: true, nest: true })
      .then((restaurants) => {
        res.render('admin/home', { restaurants })
      })
      .catch((error) => console.log(error))
  },
  createRestaurant: (req, res) => {
    res.render('admin/create')
  },
  postRestaurants: (req, res) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) {
      req.flash('error_messages', '名稱為必填！')
      return res.redirect('back')
    }
    Restaurant.create({
      name,
      tel,
      address,
      openingHours,
      description
    })
      .then((restaurant) => {
        req.flash('success_messages', `已成功建立"${restaurant.name}"餐廳！`)
        res.redirect('/admin/restaurants')
      })
      .catch((error) => console.log(error))
  }
}

module.exports = adminController
