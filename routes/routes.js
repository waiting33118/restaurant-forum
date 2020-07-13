const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController')
const commentController = require('../controllers/commentController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  return res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) return next()
    return res.redirect('/')
  }
  res.redirect('/signin')
}

// home
router.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
router.get('/restaurants', authenticated, restController.getRestaurants)
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get('/restaurants/top', authenticated, restController.getTopRestaurant)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get(
  '/restaurants/:id/dashboard',
  authenticated,
  restController.getDashboard
)

// comment
router.post('/comments', authenticated, commentController.postComment)
router.delete(
  '/comments/:id',
  authenticatedAdmin,
  commentController.deleteComment
)

// favorite
router.post(
  '/favorite/:restaurantId',
  authenticated,
  userController.addFavorite
)
router.delete(
  '/favorite/:restaurantId',
  authenticated,
  userController.deleteFavorite
)

// like
router.post('/like/:restaurantId', authenticated, userController.like)
router.delete('/like/:restaurantId', authenticated, userController.unlike)

// following
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete(
  '/following/:userId',
  authenticated,
  userController.removeFollowing
)

// admin
router.get('/admin', authenticatedAdmin, (req, res) =>
  res.redirect('/admin/restaurants')
)
router.get(
  '/admin/restaurants',
  authenticatedAdmin,
  adminController.getRestaurants
)
router.get(
  '/admin/restaurants/create',
  authenticatedAdmin,
  adminController.createRestaurant
)
router.get(
  '/admin/restaurants/:id',
  authenticatedAdmin,
  adminController.getRestaurant
)
router.get(
  '/admin/restaurants/:id/edit',
  authenticatedAdmin,
  adminController.editRestaurant
)
router.post(
  '/admin/restaurants',
  authenticatedAdmin,
  upload.single('image'),
  adminController.postRestaurants
)
router.put(
  '/admin/restaurants/:id',
  authenticatedAdmin,
  upload.single('image'),
  adminController.putRestaurant
)
router.delete(
  '/admin/restaurants/:id',
  authenticatedAdmin,
  adminController.deleteRestaurant
)

// categories
router.get(
  '/admin/categories',
  authenticatedAdmin,
  categoryController.getCategories
)
router.get(
  '/admin/categories/:id',
  authenticatedAdmin,
  categoryController.getCategories
)
router.post(
  '/admin/categories',
  authenticatedAdmin,
  categoryController.postCategories
)
router.put(
  '/admin/categories/:id',
  authenticatedAdmin,
  categoryController.putCategories
)
router.delete(
  '/admin/categories/:id',
  authenticatedAdmin,
  categoryController.deleteCategories
)

// user
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)
router.put('/admin/users/:id', authenticatedAdmin, adminController.putUsers)
router.get('/users/top', authenticated, userController.getTopUser)
router.get('/users/:id', authenticated, userController.getUser)
router.get('/users/me/edit', authenticated, userController.editUser)
router.put(
  '/users/me',
  authenticated,
  upload.single('image'),
  userController.putUser
)

// signin & signup
router.get('/signup', userController.signUpPage)
router.get('/signin', userController.signInPage)
router.get('/logout', userController.logout)
router.post('/signup', userController.signUp)
router.post(
  '/signin',
  passport.authenticate('local', { failureRedirect: '/signin' }),
  userController.signIn
)

module.exports = router
