const fs = require('fs')
const db = require('../models')
const Restaurant = db.Restaurant

const adminController = {
  getRestaurants: (req, res) => {
    Restaurant.findAll({ raw: true, nest: true })
      .then((restaurants) => {
        res.render('admin/home', { restaurants })
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
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          Restaurant.create({
            name,
            tel,
            address,
            openingHours,
            description,
            image: file ? `/upload/${file.originalname}` : null
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
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          Restaurant.findByPk(id, { raw: true })
            .then((restaurant) => {
              Restaurant.update(
                {
                  name,
                  tel,
                  address,
                  openingHours,
                  description,
                  image: file
                    ? `/upload/${file.originalname}`
                    : restaurant.image
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
  }
}

module.exports = adminController
