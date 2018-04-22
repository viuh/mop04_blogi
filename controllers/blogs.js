const blogsRouter = require('express').Router()
const Blog = require('../models/blog')



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
  /*Blog
    .find({})
    .then(blogs => {
      response.json(blogs.map(formatBlog))
    })*/
  const blogs = await Blog.find({})
  response.json(blogs.map(formatBlog))
})


blogsRouter.get('/:id', async (request, response) => {

  try {
    const blog = await Blog.findById(request.params.id)


    if (blog) {
      response.json(formatBlog(blog))
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

blogsRouter.post('/', async (request, response) => {

  try {
    const body = request.body
    //console.log('Postaus:',body)

    if (body === undefined || (body.title === undefined && body.url === undefined )) {
      response.status(400).json({ error: 'title and url missing' })
    } else {

      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes === undefined ? 0 : body.likes
      })

      const savedOne = await blog.save()
      response.json(formatBlog(blog))
    }
  } catch (exception) {
    console.log(exception)
    response.status(400).json({ error: 'something went wrong...' })
  }

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


