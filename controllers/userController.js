const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

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
              password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
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
  }
}

module.exports = userController
