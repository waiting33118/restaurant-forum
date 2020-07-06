const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

module.exports = (app, passport) => {
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
  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', authenticated, restController.getRestaurants)

  // admin
  app.get('/admin', authenticatedAdmin, (req, res) =>
    res.redirect('/admin/restaurants')
  )
  app.get(
    '/admin/restaurants',
    authenticatedAdmin,
    adminController.getRestaurants
  )
  app.get(
    '/admin/restaurants/create',
    authenticatedAdmin,
    adminController.createRestaurant
  )
  app.get(
    '/admin/restaurants/:id',
    authenticatedAdmin,
    adminController.getRestaurant
  )
  app.get(
    '/admin/restaurants/:id/edit',
    authenticatedAdmin,
    adminController.editRestaurant
  )
  app.post(
    '/admin/restaurants',
    authenticatedAdmin,
    upload.single('image'),
    adminController.postRestaurants
  )
  app.put(
    '/admin/restaurants/:id',
    authenticatedAdmin,
    upload.single('image'),
    adminController.putRestaurant
  )
  app.delete(
    '/admin/restaurants/:id',
    authenticatedAdmin,
    adminController.deleteRestaurant
  )

  // categories
  app.get(
    '/admin/categories',
    authenticatedAdmin,
    categoryController.getCategories
  )
  app.get(
    '/admin/categories/:id',
    authenticatedAdmin,
    categoryController.getCategories
  )
  app.post(
    '/admin/categories',
    authenticatedAdmin,
    categoryController.postCategories
  )
  app.put(
    '/admin/categories/:id',
    authenticatedAdmin,
    categoryController.putCategories
  )
  app.delete(
    '/admin/categories/:id',
    authenticatedAdmin,
    categoryController.deleteCategories
  )

  // user
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  app.put('/admin/users/:id', authenticatedAdmin, adminController.putUsers)

  // signin & signup
  app.get('/signup', userController.signUpPage)
  app.get('/signin', userController.signInPage)
  app.get('/logout', userController.logout)
  app.post('/signup', userController.signUp)
  app.post(
    '/signin',
    passport.authenticate('local', { failureRedirect: '/signin' }),
    userController.signIn
  )
}
