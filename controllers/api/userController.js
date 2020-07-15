const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const db = require('../../models')
const User = db.User

const userController = {
  signIn: (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
      return res.json({ status: 'error', message: '信箱和密碼為必填！' })
    }
    User.findOne({ where: { email } }).then(user => {
      if (!user) return res.status(401).json({ status: 'error', message: '此信箱尚未註冊！' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: '密碼錯誤！' })
      }
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      res.json({
        status: 'success',
        message: 'ok',
        token,
        user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin }
      })
    }).catch(error => console.log(error))
  },
  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    if (passwordCheck !== password) {
      return res.json({ status: 'error', message: '密碼與確認密碼不相符，請重新確認！' })
    } else {
      User.findOne({ where: { email } }).then(user => {
        if (user) {
          return res.json({ status: 'error', message: '信箱已被註冊！' })
        } else {
          User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
          }).then(() => res.json({ status: 'success', message: '已成功註冊帳號！' }))
            .catch(error => console.log(error))
        }
      }).catch(error => console.log(error))
    }
  }
}

module.exports = userController
