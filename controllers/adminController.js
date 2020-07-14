const db = require('../models')
const imgur = require('imgur-node-api')
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const adminService = require('../services/adminService')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (restaurants) => {
      res.render('admin/restaurants', { restaurants })
    })
  },
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (restaurant) => {
      res.render('admin/restaurant', { restaurant })
    })
  },
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (result) => {
      if (result.status === 'success') res.redirect('/admin/restaurants')
    })
  },
  createRestaurant: (req, res) => {
    Category.findAll({ raw: true, nest: true })
      .then((categories) => res.render('admin/create', { categories }))
      .catch((error) => console.log(error))
  },
  postRestaurants: (req, res) => {
    const {
      name,
      tel,
      address,
      openingHours,
      description,
      categoryId
    } = req.body
    const { file } = req

    if (!name) {
      req.flash('error_messages', '名稱為必填！')
      return res.redirect('back')
    }
    if (file) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) console.log('Error', err)
        Restaurant.create({
          name,
          tel,
          address,
          openingHours,
          description,
          image: file ? img.data.link : null,
          CategoryId: categoryId
        })
          .then((restaurant) => {
            req.flash(
              'success_messages',
              `已成功建立"${restaurant.name}"餐廳！`
            )
            res.redirect('/admin/restaurants')
          })
          .catch((error) => console.log(error))
      })
    } else {
      Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: null,
        CategoryId: categoryId
      })
        .then((restaurant) => {
          req.flash('success_messages', `已成功建立"${restaurant.name}"餐廳！`)
          res.redirect('/admin/restaurants')
        })
        .catch((error) => console.log(error))
    }
  },
  editRestaurant: (req, res) => {
    const { id } = req.params
    Category.findAll({ raw: true, nest: true })
      .then((categories) => {
        Restaurant.findByPk(id, { raw: true })
          .then((restaurant) =>
            res.render('admin/create', { restaurant, categories })
          )
          .catch((error) => console.log(error))
      })
      .catch((error) => console.log(error))
  },
  putRestaurant: (req, res) => {
    const {
      name,
      tel,
      address,
      openingHours,
      description,
      categoryId
    } = req.body
    const { id } = req.params
    const { file } = req

    if (!name) {
      req.flash('error_messages', '名稱為必填！')
      return res.redirect('back')
    }
    if (file) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) console.log('Error', err)
        Restaurant.findByPk(id)
          .then((restaurant) => {
            restaurant
              .update({
                name,
                tel,
                address,
                openingHours,
                description,
                image: file ? img.data.link : restaurant.image,
                CategoryId: categoryId
              })
              .catch((error) => console.log(error))
          })
          .then(() => {
            req.flash('success_messages', '已成功修改餐廳明細！')
            res.redirect('/admin/restaurants')
          })
          .catch((error) => console.log(error))
      })
    } else {
      Restaurant.findByPk(id, { raw: true })
        .then((restaurant) => {
          Restaurant.update(
            {
              name,
              tel,
              address,
              openingHours,
              description,
              image: restaurant.image,
              CategoryId: categoryId
            },
            { where: { id } }
          ).catch((error) => console.log(error))
        })
        .then(() => {
          req.flash('success_messages', '已成功修改餐廳明細！')
          res.redirect('/admin/restaurants')
        })
        .catch((error) => console.log(error))
    }
  },
  getUsers: (req, res) => {
    User.findAll({ raw: true, nest: true, order: [['id', 'ASC']] })
      .then((users) => res.render('admin/users', { users }))
      .catch((error) => console.log(error))
  },
  putUsers: (req, res) => {
    const { id } = req.params
    User.findByPk(id)
      .then((user) => {
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
      .catch((error) => console.log(error))
  }
}

module.exports = adminController
