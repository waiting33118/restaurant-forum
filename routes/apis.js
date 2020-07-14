const express = require('express')
const router = express.Router()

const adminController = require('../controllers/api/adminController')
const categoryController = require('../controllers/api/categoryController')

// admin
router.get('/admin/restaurants', adminController.getRestaurants)
router.get('/admin/restaurant/:id', adminController.getRestaurant)
router.delete('/admin/restaurant/:id', adminController.deleteRestaurant)

// category
router.get('/admin/categories', categoryController.getCategories)

module.exports = router
