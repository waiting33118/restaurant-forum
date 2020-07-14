const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const adminController = require('../controllers/api/adminController')
const categoryController = require('../controllers/api/categoryController')

// admin
router.get('/admin/restaurants', adminController.getRestaurants)
router.get('/admin/restaurant/:id', adminController.getRestaurant)
router.post('/admin/restaurants', upload.single('image'), adminController.postRestaurants)
router.put('/admin/restaurant/:id', upload.single('image'), adminController.putRestaurant)
router.delete('/admin/restaurant/:id', adminController.deleteRestaurant)

// category
router.get('/admin/categories', categoryController.getCategories)
router.post('/admin/categories', categoryController.postCategories)
router.put('/admin/categories/:id', categoryController.putCategories)
module.exports = router
