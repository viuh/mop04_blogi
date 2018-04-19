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


blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs.map(formatBlog))
    })
})



blogsRouter.get('/:id', (request, response) => {
  Blog
    .findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(formatBlog(blog))
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

blogsRouter.delete('/:id', (request, response) => {
  const id = request.param.id

  Blog
    .findByIdAndRemove(request.params.id)
    .then(result => {
      console.log(result)
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id'+id })
    })
})

blogsRouter.post('/', (request, response) => {
  const body = request.body
  console.log('Postaus:',body)
  if (body.title === undefined) {
    response.status(400).json({ error: 'title missing' })
  }


  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes
    //id: blog._id
    //content: body.content,
    //important: body.important === undefined ? false : body.important,
    //date: new Date()
  })

  blog
    .save()
    .then(note => {
      return formatBlog(note)
    })
    .then(formattedNote => {
      response.json(formattedNote)
    })

})



module.exports = blogsRouter


//5ad8dbe91bf337ba88054770
// -------------------------------------
/*blogsRouter.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})*/

/*blogsRouter.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})*/
