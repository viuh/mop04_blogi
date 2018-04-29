const bcryptjs = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')



usersRouter.post('/', async (request, response) => {

  const body = request.body  //request ei tuo==

  try {
    //console.log('tyyppis:',body.username, ' salis: ', body.password)

    if (body.password.length < 3) {
      return response.status(400).json({ error: 'Password is too short , should be >3' })
    }

    const existingUser = await User.find({ username: body.username })
    if (existingUser.length>0) {
      return response.status(400).json({ error: 'username must be unique' })
    }


    const saltRounds = 10
    var salt = bcryptjs.genSaltSync(saltRounds)
    const passwordHash = await bcryptjs.hashSync(body.password, salt)

    const user = new User({
      username: body.username,
      name: body.name,
      adult: body.adult === undefined ? true : body.adult,
      passwordHash
    })

    //console.log('USeri controlleris:', user)

    const savedUser = await user.save()

    //TTT
    const userForToken = {
      username: savedUser.username,
      id: savedUser._id
    }

    const token = jwt.sign(userForToken, process.env.SECRET)
    console.log('Usename:'+user.username,' id: ',savedUser._id,  '- token:',token)

    //console.log('USeri controlleris:222', savedUser)

    response.json(User.format(savedUser))
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { title: 1, url: 1 })

  response.json(users.map(User.format))
})


module.exports = usersRouter