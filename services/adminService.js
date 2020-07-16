const imgur = require('imgur-node-api')

const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User

const adminService = {
  getRestaurants: (req, res, callback) => {
    Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category],
      order: [['id', 'ASC']]
    })
      .then(restaurants => callback(restaurants))
      .catch(error => console.log(error))
  },
  getRestaurant: (req, res, callback) => {
    Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurant => callback(restaurant))
      .catch(error => console.log(error))
  },
  deleteRestaurant: (req, res, callback) => {
    Restaurant.findByPk(req.params.id)
      .then(restaurant => restaurant.destroy())
      .then(() => callback({ status: 'success', message: '' }))
      .catch(error => console.log(error))
  },
  postRestaurants: (req, res, callback) => {
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
      return callback({ status: 'error', message: '名稱為必填！' })
    }
    if (file) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) console.log(err)
        createRestaurant(img)
      })
    } else {
      createRestaurant()
    }

    function createRestaurant (img) {
      Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: img ? img.data.link : null,
        CategoryId: categoryId
      })
        .then(restaurant => {
          callback({
            status: 'success',
            message: `已成功建立"${restaurant.name}"餐廳！`
          })
        })
        .catch(error => console.log(error))
    }
  },
  putRestaurant: (req, res, callback) => {
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
      return callback({ status: 'error', message: '名稱為必填！' })
    }
    if (file) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) console.log(err)
        updateRestaurant(img)
      })
    } else {
      updateRestaurant()
    }

    function updateRestaurant (img) {
      Restaurant.findByPk(req.params.id)
        .then(restaurant => {
          restaurant
            .update({
              name,
              tel,
              address,
              openingHours,
              description,
              image: img ? img.data.link : restaurant.image,
              CategoryId: categoryId
            })
            .catch(error => console.log(error))
        })
        .then(() => {
          callback({ status: 'success', message: '已成功修改餐廳明細！' })
        })
        .catch(error => console.log(error))
    }
  },
  getUsers: (req, res, callback) => {
    User.findAll({ raw: true, nest: true, order: [['id', 'ASC']] })
      .then(users => callback(users))
      .catch(error => console.log(error))
  }
}

module.exports = adminService
