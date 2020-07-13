const adminService = require('../../services/adminService')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (restaurants) =>
      res.json({ restaurants })
    )
  },
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (restaurant) =>
      res.json({ restaurant })
    )
  }
}

module.exports = adminController
