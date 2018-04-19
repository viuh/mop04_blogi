//const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
//const Blog = require('./models/blog')


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

const dbname = process.env.DBNAME

console.log('Dbname:',dbname)

const mongoUrl = 'mongodb://'+process.env.DBUSER+':'+process.env.DBPASS+dbname

//mongoose.connect(mongoUrl)

mongoose
  .connect(mongoUrl)
  .then( () => {
    console.log('connected to database', dbname)
  })
  .catch( err => {
    console.log(err)
  })


// -----------------------------
const blogsRouter = require('./controllers/blogs')
app.use('/api/blogs', blogsRouter)


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
