const express = require('express')
const exphdbs = require('express-handlebars')

const db = require('./models')
const useRoutes = require('./routes')

const app = express()
const PORT = 3000

app.engine('handlebars', exphdbs())
app.set('view engine', 'handlebars')

app.listen(PORT, () => {
  db.sequelize.sync()
  console.log(`The server is running on PORT:${PORT}`)
})
useRoutes(app)
