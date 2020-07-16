const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const passport = require('../config/passport')

const authenticated = passport.authenticate('jwt', { session: false })
const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin) return next()
    return res.json({ status: 'error', message: 'permission denied: You are not Admin' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}
const adminController = require('../controllers/api/adminController')
const userController = require('../controllers/api/userController')
const categoryController = require('../controllers/api/categoryController')

// admin - restaurant
router.get('/admin/restaurants', authenticated, authenticatedAdmin, adminController.getRestaurants)
router.get('/admin/restaurant/:id', authenticated, authenticatedAdmin, adminController.getRestaurant)
router.post('/admin/restaurants', authenticated, authenticatedAdmin, upload.single('image'), adminController.postRestaurants)
router.put('/admin/restaurant/:id', authenticated, authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
router.delete('/admin/restaurant/:id', authenticated, authenticatedAdmin, adminController.deleteRestaurant)

// admin - category
router.get('/admin/categories', authenticated, authenticatedAdmin, categoryController.getCategories)
router.post('/admin/categories', authenticated, authenticatedAdmin, categoryController.postCategories)
router.put('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.putCategories)
router.delete('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.deleteCategories)

// admin - user
router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)

// JWT signin/up
router.post('/signin', userController.signIn)
router.post('/signup', userController.signUp)

module.exports = router
