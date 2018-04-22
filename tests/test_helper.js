
const Blog = require('../models/blog')
const User = require('../models/user')


const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

const format = (blog) => {
  return {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
    id: blog._id
  }
}


const blogsInDb = async () => {
  const blogs = await Blog.find({})

  //console.log('ZZZ blogsindb:', blogs.length)
  return blogs.map(format)
}


const usersInDb = async () => {
  const users = await User.find({})
  return users
}




module.exports = {
  initialBlogs, format, blogsInDb, usersInDb
}



