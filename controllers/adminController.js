const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const adminService = require('../services/adminService')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, restaurants =>
      res.render('admin/restaurants', { restaurants })
    )
  },
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, restaurant =>
      res.render('admin/restaurant', { restaurant })
    )
  },
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, result => {
      if (result.status === 'success') res.redirect('/admin/restaurants')
    })
  },
  postRestaurants: (req, res) => {
    adminService.postRestaurants(req, res, result => {
      if (result.status === 'error') {
        req.flash('error_messages', result.message)
        return res.redirect('back')
      }
      req.flash('success_messages', result.message)
      res.redirect('/admin/restaurants')
    })
  },
  createRestaurant: (req, res) => {
    Category.findAll({ raw: true, nest: true })
      .then(categories => res.render('admin/create', { categories }))
      .catch(error => console.log(error))
  },
  editRestaurant: (req, res) => {
    const { id } = req.params
    Category.findAll({ raw: true, nest: true })
      .then(categories => {
        Restaurant.findByPk(id, { raw: true })
          .then(restaurant =>
            res.render('admin/create', { restaurant, categories })
          )
          .catch(error => console.log(error))
      })
      .catch(error => console.log(error))
  },
  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, result => {
      if (result.status === 'error') {
        req.flash('error_messages', result.message)
        return res.redirect('back')
      }
      req.flash('success_messages', result.message)
      res.redirect('/admin/restaurants')
    })
  },
  getUsers: (req, res) => {
    User.findAll({ raw: true, nest: true, order: [['id', 'ASC']] })
      .then(users => res.render('admin/users', { users }))
      .catch(error => console.log(error))
  },
  putUsers: (req, res) => {
    const { id } = req.params
    User.findByPk(id)
      .then(user => {
        if (req.user.id === Number(user.id)) {
          req.flash('error_messages', '管理員無法變更自己的權限！')
          return res.redirect('/admin/users')
        }
        if (user.isAdmin) {
          user.update({ isAdmin: false })
        } else {
          user.update({ isAdmin: true })
        }
        req.flash('success_messages', '已成功修改會員權限！')
        res.redirect('/admin/users')
      })
      .catch(error => console.log(error))
  }
}

module.exports = adminController
