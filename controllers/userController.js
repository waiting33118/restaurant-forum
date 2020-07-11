const bcrypt = require('bcryptjs')
const imgur = require('imgur-node-api')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship

const userController = {
  signUpPage: (req, res) => res.render('signup'),
  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body

    if (password !== passwordCheck) {
      req.flash('error_messages', '密碼與確認密碼不相符，請重新確認！')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email } })
        .then((user) => {
          if (user) {
            req.flash('error_messages', '信箱已被註冊！')
            return res.redirect('/signup')
          } else {
            User.create({
              name,
              email,
              password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
              image: 'https://picsum.photos/300'
            })
              .then((user) => {
                req.flash('success_messages', '已成功註冊帳號！')
                return res.redirect('/signin')
              })
              .catch((error) => console.log(error))
          }
        })
        .catch((error) => console.log(error))
    }
  },
  signInPage: (req, res) => res.render('signin'),
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res) => {
    const { id } = req.params

    User.findByPk(id, { include: { model: Comment, include: [Restaurant] } })
      .then((user) => {
        const data = user.toJSON()
        const totalComments = data.Comments.length
        res.render('userProfile', { user: data, totalComments })
      })
      .catch((error) => console.log(error))
  },
  editUser: (req, res) => {
    const { id } = req.user
    User.findByPk(id, { raw: true })
      .then((user) => {
        res.render('userProfileEdit', { user })
      })
      .catch((error) => console.log(error))
  },
  putUser: (req, res) => {
    const { id } = req.user
    const { name } = req.body
    const { file } = req

    if (!name) {
      req.flash('error_messages', '名稱為必填！')
      return res.redirect('back')
    }
    if (file) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) console.log(err)
        update(img)
      })
    } else {
      update()
    }
    function update(img) {
      User.findByPk(id)
        .then((user) =>
          user
            .update({
              name,
              image: img ? img.data.link : user.image
            })
            .catch((error) => console.log(error))
        )
        .then(() => {
          req.flash('success_messages', '已成功修改個人資訊！')
          res.redirect(`/users/${id}`)
        })
        .catch((error) => console.log(error))
    }
  },
  addFavorite: (req, res) => {
    Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then(() => res.redirect('back'))
      .catch((error) => console.log(error))
  },
  deleteFavorite: (req, res) => {
    Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((favorite) => favorite.destroy())
      .then(() => res.redirect('back'))
      .catch((error) => console.log(error))
  },
  like: (req, res) => {
    Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then(() => res.redirect('back'))
      .catch((error) => console.log(error))
  },
  unlike: (req, res) => {
    Like.findOne({
      where: { UserId: req.user.id, RestaurantId: req.params.restaurantId }
    })
      .then((like) => like.destroy())
      .then(() => res.redirect('back'))
      .catch((error) => console.log(error))
  },
  getTopUser: (req, res) => {
    User.findAll({ include: [{ model: User, as: 'Followers' }] })
      .then((users) => {
        users = users.map((user) => ({
          ...user.dataValues,
          FollowerCount: user.Followers.length,
          isFollowed: req.user.Followings.map((d) => d.id).includes(user.id)
        }))
        users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
        res.render('topUser', { users })
      })
      .catch((error) => console.log(error))
  },
  addFollowing: (req, res) => {
    Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
      .then(() => res.redirect('back'))
      .catch((error) => console.log(error))
  },
  removeFollowing: (req, res) => {
    Followship.findOne({
      where: { followerId: req.user.id, followingId: req.params.userId }
    })
      .then((followship) => {
        followship.destroy()
      })
      .then(() => res.redirect('back'))
      .catch((error) => console.log(error))
  }
}

module.exports = userController
