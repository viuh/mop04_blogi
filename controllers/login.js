const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const body = request.body
  console.log('DDD ', body)

  try {
    const user = await User.findOne({ username: body.username })
    const passwordCorrect = user === null ?
      false :
      await bcryptjs.compareSync(body.password, user.passwordHash)

    if ( !(user && passwordCorrect) ) {
      return response.status(401).send({ error: 'invalid username or password' })
    }

    const userForToken = {
      username: user.username,
      id: user._id
    }

    const token = jwt.sign(userForToken, process.env.SECRET)
    console.log('Username:'+user.username, '- token:',token)
    response.status(200).send({ token, username: user.username, name: user.name })
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })

  }
})

module.exports = loginRouter