const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const morgan = require('morgan')
const dotenv = require('dotenv')
const PORT = process.env.PORT || 1337
const passport = require('passport')
const session = require('express-session')
const db = require('./config/datastore')

// Database connection/authentication
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log(`Error: ${err}`))

dotenv.config()

const app = express()
require('./config/passport')(passport)
const routesConfig = require('./config/routes')

/** Middleware */

// EJS Layout and Templating
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('layout', 'layouts/layout')
app.use(express.static('assets'))
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
)
app.use(passport.initialize())
app.use(passport.session())


// Routes
app.use('/', routesConfig)

app.listen(PORT, () => console.log(`
  Server started on port: ${PORT}
  `
))
