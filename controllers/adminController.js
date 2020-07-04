const db = require('../models')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = 'e20d4219335a0f4'
const Restaurant = db.Restaurant
const User = db.User

const adminController = {
  getRestaurants: (req, res) => {
    Restaurant.findAll({ raw: true, nest: true })
      .then((restaurants) => {
        res.render('admin/restaurants', { restaurants })
      })
      .catch((error) => console.log(error))
  },
  getRestaurant: (req, res) => {
    const { id } = req.params
    Restaurant.findByPk(id, { raw: true })
      .then((restaurant) => {
        res.render('admin/restaurant', { restaurant })
      })
      .catch((error) => console.log(error))
  },
  createRestaurant: (req, res) => {
    res.render('admin/create')
  },
  postRestaurants: (req, res) => {
    const { name, tel, address, openingHours, description } = req.body
    const { file } = req

    if (!name) {
      req.flash('error_messages', '名稱為必填！')
      return res.redirect('back')
    }
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) console.log('Error', err)
        Restaurant.create({
          name,
          tel,
          address,
          openingHours,
          description,
          image: file ? img.data.link : null
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
        image: null
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
    Restaurant.findByPk(id, { raw: true }).then((restaurant) => {
      res.render('admin/create', { restaurant })
    })
  },
  putRestaurant: (req, res) => {
    const { name, tel, address, openingHours, description } = req.body
    const { id } = req.params
    const { file } = req

    if (!name) {
      req.flash('error_messages', '名稱為必填！')
      return res.redirect('back')
    }
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) console.log('Error', err)
        Restaurant.findByPk(id, { raw: true })
          .then((restaurant) => {
            Restaurant.update(
              {
                name,
                tel,
                address,
                openingHours,
                description,
                image: file ? img.data.link : restaurant.image
              },
              { where: { id } }
            ).catch((error) => console.log(error))
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
              image: restaurant.image
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
  deleteRestaurant: (req, res) => {
    const { id } = req.params
    Restaurant.findByPk(id)
      .then((restaurant) => {
        restaurant.destroy()
        res.redirect('/admin/restaurants')
      })
      .catch((error) => console.log(error))
  },
  getUsers: (req, res) => {
    User.findAll({ raw: true, nest: true })
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
