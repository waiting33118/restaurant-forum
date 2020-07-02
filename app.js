const express = require('express')
const exphdbs = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')

const db = require('./models')
const useRoutes = require('./routes')

const app = express()
const PORT = 3000

app.engine('handlebars', exphdbs())
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  session({ secret: 'ThisIsMySecret', resave: false, saveUninitialized: false })
)
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

app.listen(PORT, () => {
  console.log(`The server is running on PORT:${PORT}`)
})
useRoutes(app)
