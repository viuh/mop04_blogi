const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const usersRouter = require('./controllers/users')

app.use('/api/users', usersRouter)

//const Blog = require('./models/blog')
const config = require('./utils/config')
app.use(express.static('build'))
//app.use(middleware.logger)

var morgan = require('morgan')

app.use(morgan(':method :url :type :status :res[content-length] - :response-time ms'))


morgan.token('type', function (req) {
  //console.log('dda',req.body)
  return JSON.stringify(req.body)

})

app.use(cors())
app.use(bodyParser.json())


require('dotenv').config()

if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}

//const mongoUrl = 'mongodb://'+process.env.DBUSER+':'+process.env.DBPASS+dbname
//mongoose.connect(mongoUrl)

mongoose.connect(config.mongoUrl)
mongoose.Promise = global.Promise

/*  .then( () => {
    console.log('connected to database', config.mongoUrl)
  })
  .catch( err => {
    console.log('Stuff', err)
  })
*/

// -----------------------------
const blogsRouter = require('./controllers/blogs')
app.use('/api/blogs', blogsRouter)


//app.use(middleware.error)

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}


/*const PORT = config.port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})*/
