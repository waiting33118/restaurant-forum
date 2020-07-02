const express = require('express')
const exphdbs = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')

const db = require('./models')
const useRoutes = require('./routes')
const passport = require('./config/passport')

const app = express()
const PORT = 3000

app.engine('handlebars', exphdbs())
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  session({ secret: 'ThisIsMySecret', resave: false, saveUninitialized: false })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})

app.listen(PORT, () => {
  console.log(`The server is running on PORT:${PORT}`)
})
useRoutes(app, passport)
