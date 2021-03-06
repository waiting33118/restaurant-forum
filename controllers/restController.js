const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const pageLimit = 9

const restController = {
  getRestaurants: (req, res) => {
    const whereQuery = {}
    let offset = 0
    let { categoryId, page } = req.query

    if (page) {
      offset = (Number(page) - 1) * pageLimit
    }
    if (categoryId) {
      categoryId = Number(categoryId)
      whereQuery.CategoryId = categoryId
    }
    Restaurant.findAndCountAll({
      raw: true,
      nest: true,
      include: [Category],
      where: whereQuery,
      limit: pageLimit,
      offset
    })
      .then((restaurants) => {
        const currentPage = Number(page) || 1
        const pageLength = Math.ceil(restaurants.count / pageLimit)
        const totalPage = Array.from({ length: pageLength }).map(
          (value, index) => index + 1
        )
        const previousPage = currentPage - 1 < 1 ? 1 : currentPage - 1
        const nextPage =
          currentPage + 1 > pageLength ? pageLength : currentPage + 1

        const data = restaurants.rows.map((r) => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: req.user.FavoritedRestaurants.map((d) => d.id).includes(
            r.id
          ),
          liked: req.user.LikedRestaurants.map((d) => d.id).includes(r.id)
        }))
        Category.findAll({ raw: true, nest: true })
          .then((categories) =>
            res.render('restaurants', {
              restaurants: data,
              categories,
              categoryId,
              currentPage,
              totalPage,
              previousPage,
              nextPage
            })
          )
          .catch((error) => console.log(error))
      })
      .catch((error) => console.log(error))
  },
  getRestaurant: (req, res) => {
    const { id } = req.params
    Restaurant.findByPk(id, {
      include: [
        Category,
        { model: Comment, include: [User] },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' }
      ]
    })
      .then((restaurant) => {
        restaurant.increment('viewCounts')
        restaurant.save({ fields: ['viewCounts'] })
        const isFavorited = restaurant.FavoritedUsers.map((d) => d.id).includes(
          req.user.id
        )
        const liked = restaurant.LikedUsers.map((d) => d.id).includes(
          req.user.id
        )
        res.render('restaurant', {
          restaurant: restaurant.toJSON(),
          isFavorited,
          liked
        })
      })
      .catch((error) => console.log(error))
  },
  getFeeds: (req, res) => {
    Restaurant.findAll({
      raw: true,
      nest: true,
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [Category]
    })
      .then((restaurants) => {
        Comment.findAll({
          raw: true,
          nest: true,
          limit: 10,
          order: [['createdAt', 'DESC']],
          include: [User, Restaurant]
        })
          .then((comments) => {
            res.render('feeds', { restaurants, comments })
          })
          .catch((error) => console.log(error))
      })
      .catch((error) => console.log(error))
  },
  getDashboard: (req, res) => {
    const { id } = req.params
    Restaurant.findByPk(id, {
      include: [Category, Comment, { model: User, as: 'FavoritedUsers' }]
    })
      .then((restaurant) => {
        restaurant = restaurant.toJSON()
        restaurant.TotalComments = restaurant.Comments.length
        restaurant.TotalFavorites = restaurant.FavoritedUsers.length
        res.render('dashboard', { restaurant })
      })
      .catch((error) => console.log(error))
  },
  getTopRestaurant: (req, res) => {
    Restaurant.findAll({
      include: [{ model: User, as: 'FavoritedUsers' }]
    })
      .then((restaurants) => {
        restaurants = restaurants.map((restaurant) => ({
          ...restaurant.dataValues,
          FavoritedCount: restaurant.FavoritedUsers.length,
          description: restaurant.description.substring(0, 50),
          isFavorited: req.user.FavoritedRestaurants.map((d) => d.id).includes(
            restaurant.id
          )
        }))
        restaurants = restaurants
          .sort((a, b) => b.FavoritedCount - a.FavoritedCount)
          .slice(0, 10)
        res.render('topRestaurant', { restaurants })
      })
      .catch((error) => console.log(error))
  }
}

module.exports = restController
