
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

let port = process.env.PORT
//let mongoUrl = process.env.MONGODB_URI

let mongoUrl = 'mongodb://'+process.env.DBUSER+':'+process.env.DBPASS+process.env.DBNAME

if (process.env.NODE_ENV === 'test') {
  port = process.env.TEST_PORT

  //mongoUrl = process.env.TEST_MONGODB_URI
  mongoUrl = 'mongodb://'+process.env.TESTUSER+':'+process.env.TESTPASS+process.env.TESTDBNAME


}

module.exports = {
  mongoUrl,
  port
}