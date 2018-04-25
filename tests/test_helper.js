
const Blog = require('../models/blog')
const User = require('../models/user')


const aToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1sdXVra2FpIiwiaWQiOiI1YWRmOGE2N2JjNmU3YjZiNTk1NjFkODEiLCJpYXQiOjE1MjQ2Nzk2MzR9.ZE8lPEp5PhXFAWybmo29aqeQ_a-0a44huEBPDIni0Yc'
//'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5uaWNrMyIsImlkIjoiNWFkZjg2ZWZmZDU0YTBkZmIxNTY1MjVmIiwiaWF0IjoxNTI0NTk4NTQxfQ.zzdoh7B7wMYoExd1JnTqGPrIMGB0pIEhf4GJGeCKqFo' 
//'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5uaWNrIiwiaWQiOiI1YWRmODE2N2U3Y2VhZTU1MzRhYTNmOGYiLCJpYXQiOjE1MjQ1OTcxNDV9.t9C_Xm2prK2Rm5AyENK5hc-iydexMptdRySn7OeTAys' 
//'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1sdXVra2FpIiwiaWQiOiI1YWRkMDU5OTQ3OGI0ZjFiNDVlNTVkYzYiLCJpYXQiOjE1MjQ1MDcwNjB9.BSEc319c-5VnbOuwonC5BZuf4fg5lNW39WNdx-USTGg'
//'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1sdXVra2FpIiwiaWQiOiI1YWUwYzk1YjdmMDlkZDMxNGQ3ZWEyOGIiLCJpYXQiOjE1MjQ2ODEyODl9.rRMphJ-V9sayCvjTwWCW3RmRkIPXLctgti3aEuR7JbM'

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
  initialBlogs, format, blogsInDb, usersInDb, aToken
}



