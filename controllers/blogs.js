const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


const formatBlog = (blog) => {
  return {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
    id: blog._id
  }
}


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username:1, name:1 })
  response.json(blogs.map(Blog.format))
})


blogsRouter.get('/:id', async (request, response) => {

  try {
    const blog = await Blog.findById(request.params.id)


    if (blog) {
      response.json(Blog.format(blog))
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    //console.log(exception)
    response.status(400).json({ error: 'something went weird at get id' })
  }

})

blogsRouter.delete('/:id', async (request, response) => {

  try {
    const id = request.params.id
    await Blog.findByIdAndRemove(id)
    response.status(204).end()
  } catch(exception) {
    //console.log(exception)
    response.status(400).send({ error: 'malformatted id:'+request.params.id })
  }
})

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}




blogsRouter.post('/', async (request, response) => {

  const body = request.body

  try {
    const token = getTokenFrom(request)

    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (body === undefined || (body.title === undefined && body.url === undefined )) {
      response.status(400).json({ error: 'title and url missing' })
    } else {

      const user = await User.findById(body.userId)
      console.log('UUUU: ', user)

      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes === undefined ? 0 : body.likes,
        user: body.userId
      })

      const savedOne = await blog.save()

      //+ käyttäjälle
      user.blogs = user.blogs.concat(savedOne._id)
      await user.save()

      response.json(Blog.format(blog))
    }
  } catch (exception) {
    if (exception.name === 'JsonWebTokenError' ) {
      response.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      response.status(500).json({ error: 'something went wrong...' })
    }}

})


blogsRouter.put('/:id' , async (request, response) => {

  console.log('Putti for ', request.params.id)
  try {

    const body = request.body

    const blog = {
      likes: body.likes === undefined ? 0 : body.likes
    }
    console.log('NEwer?', blog)
    let id = request.params.id

    const updatedOne = await Blog.findByIdAndUpdate( id
      , blog , { new: true }
    )
    updatedOne.save()
    response.json(updatedOne)
  } catch (exception) {
    console.log(exception)
    response.status(400).json({ error: 'something went wrong...' + request.params.id })
  }

})



/*blogsRouter.put('/:id',  (request, response) => {
  const body = request.body
  const id = request.params.id

  console.log('Putti:', id, '- paivitetaan mm.', body.title)

  if (id === undefined) {
    return response.status(400).json({ error: 'id missing: '+id })
  }

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
  }

  Blog
    .findByIdAndUpdate(id, blog, { new:true })
    .then(updatedBlog => {
      response.json(formatBlog(updatedBlog))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id: '+id })
    })
})

*/

module.exports = blogsRouter


