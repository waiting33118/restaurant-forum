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
  }
}

module.exports = userController

