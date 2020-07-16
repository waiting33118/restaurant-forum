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
    adminService.createRestaurant(req, res, categories => res.render('admin/create', { categories }))
  },
  editRestaurant: (req, res) => {
    adminService.editRestaurant(req, res, (categories, restaurant) => res.render('admin/create', { categories, restaurant }))
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
    adminService.getUsers(req, res, users => res.render('admin/users', { users }))
  },
  putUsers: (req, res) => {
    adminService.putUsers(req, res, result => {
      if (result.status === 'error') {
        req.flash('error_messages', result.message)
        return res.redirect('/admin/users')
      }
      req.flash('success_messages', result.message)
      res.redirect('/admin/users')
    })
  }
}

module.exports = adminController
