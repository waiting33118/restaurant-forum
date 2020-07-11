const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passReqToCallback: true },
    (req, email, password, done) => {
      User.findOne({ where: { email } }).then((user) => {
        if (!user) {
          return done(
            null,
            false,
            req.flash('error_messages', '帳號輸入錯誤或尚未註冊！')
          )
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(
            null,
            false,
            req.flash('error_messages', '密碼輸入錯誤！')
          )
        }
        done(null, user)
      })
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser((id, done) => {
  User.findByPk(id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' },
      { model: Restaurant, as: 'LikedRestaurants' }
    ]
  })
    .then((user) => {
      user = user.toJSON()
      done(null, user)
    })
    .catch((error) => console.log(error))
})

module.exports = passport
