const adminService = require('../../services/adminService')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (restaurants) => {
      res.json({ restaurants })
    })
  }
}

module.exports = adminController
