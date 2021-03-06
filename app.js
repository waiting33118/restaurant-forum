const express = require('express')
const path = require('path')
const exphdbs = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const override = require('method-override')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const useRoutes = require('./routes')
const passport = require('./config/passport')

const app = express()
const PORT = process.env.PORT

app.engine(
  'handlebars',
  exphdbs({ helpers: require('./config/handlebars-helpers') })
)
app.set('view engine', 'handlebars')
app.use('/upload', express.static(path.join(__dirname, '/upload')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(override('_method'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.loginUser = req.user
  next()
})

app.listen(PORT, () => {
  console.log(`The server is running on PORT:${PORT}`)
})
useRoutes(app)
