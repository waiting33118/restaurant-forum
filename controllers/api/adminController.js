const adminService = require('../../services/adminService')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, restaurants =>
      res.json({ restaurants })
    )
  },
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, restaurant => res.json({ restaurant }))
  },
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, result => res.json({ result }))
  },
  postRestaurants: (req, res) => {
    adminService.postRestaurants(req, res, result => res.json(result))
  },
  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, result => res.json(result))
  },
  getUsers: (req, res) => {
    adminService.getUsers(req, res, users => res.json({ users }))
  }
}

module.exports = adminController
