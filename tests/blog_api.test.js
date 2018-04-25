
const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { format, initialBlogs, blogsInDb, aToken } = require('./test_helper')

// --------------------------------------



beforeAll(async () => {
  await Blog.remove({})

  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})


describe('Blog api - GET tests', () => {


  test('GET notes are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('GET all notes are returned', async () => {
    const response = await api
      .get('/api/blogs')

    expect(response.body.length).toBe(initialBlogs.length)
  })


  test('GET a specific blog is within the returned blogs', async () => {
    const response = await api
      .get('/api/blogs')

    const contents = response.body.map(r => r.title)
    //console.log('XXX contents',contents)
    expect(contents).toContain('React patterns')
  })

  test('GET a blog by id', async () => {

    const first = initialBlogs[0]

    const response = await api
      .get(`/api/blogs/${first._id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    //console.log('ZZZ title:' , first.title, 'a:', response.body.title)

    expect(response.body.title).toBe(first.title)
  })

  test('GET should fail with fake id', async () => {

    const response = await api
      .get('/api/blogs/sofakeidAAA')
      .expect(400)

  })

  //
  test('GET valid, but not existing ', async () => {

    const response = await api
      .get('/api/blogs/5a422b3a1b54a676234d17f9')
      .expect(404)

  })


})



describe('Blog api - POST tests', () => {

  test('POST valid blog can be added'+aToken, async () => {

    const newBlog =  {
      _id: '5a422bc61b54a676234d17s2',
      title: 'Readability or brevity',
      author: 'Ada Lovelace',
      url: 'http://google.com',
      likes: 8,
      __v: 0
    }

    const blogsBefore =  await blogsInDb()

    await api
      .post('/api/blogs')
      .set('authorization','bearer '+aToken)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type',/application\/json/)

    const blogsAfter = await blogsInDb()

    expect(blogsAfter.length).toBe(blogsBefore.length+1)

    const contents = blogsAfter.map(r => r.title)
    expect(contents).toContain('Readability or brevity')

  })

  test('POST empty blog CANNOT be added (no token)', async () => {

    const newBlog2 =  {
      author: 'Nick None',
      token: aToken
    }

    const blogsBefore =  await blogsInDb()

    await api
      .post('/api/blogs')
      .set('authorization','bearer '+aToken)
      .send(newBlog2)
      .expect(401)

    const blogsAfter = await blogsInDb()
    const contents = blogsAfter.map(r => r.title)

    expect(blogsAfter.length).toBe(blogsBefore.length)
    //expect(contents).notContain('Readability or brevity')

  })

  test('POST without likes is initialized to zero', async () => {

    const newBlog =  {
      _id: '5a422bc61b54a676234d17s2',
      title: 'Readability or brevity',
      author: 'Ada Lovelace',
      url: 'http://google.com',
      __v: 0
    }

    const blogsBefore =  await blogsInDb()

    const response = await api
      .post('/api/blogs')
      .set('authorization','bearer '+aToken)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type',/application\/json/)

    const blogsAfter = await blogsInDb()

    expect(blogsAfter.length).toBe(blogsBefore.length+1)
    //console.log('RP', response.body)
    expect(response.body.likes).toBe(0)
  })



})

describe('Blog api - DELETE tests', () => {

  let addedBlog

  beforeAll (async () => {
    addedBlog = new Blog ({
      _id: '5a422ba71b54a676234d17fb',
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0,
      __v: 0
    })
    await addedBlog.save()
  })

  test('DELETE /api/blogs/:id succeeds ', async () => {
    const blogsBefore = await blogsInDb()

    await api
      .delete(`/api/blogs/${addedBlog._id}`)
      .expect(204)

    const blogsAfter = await blogsInDb()

    const contents = blogsAfter.map(r => r.title)

    expect(contents).not.toContain(addedBlog.content)
    expect(blogsAfter.length).toBe(blogsBefore.length - 1)
  })

  test('DELETE of notexistant id fails ', async () => {
    const blogsBefore = await blogsInDb()

    await api
      .delete('/api/blogs/sofakeid')
      .expect(400)

    const blogsAfter = await blogsInDb()

    expect(blogsAfter.length).toBe(blogsBefore.length)
  })


  afterAll(() => {
    server.close()
  })

})

/*
describe.skip('Blog api - PUT tests', () => {

  let fixedBlog
  let addedone
  beforeAll (async () => {

    //_id: '5a422bc61b54a676234d17AA',

    fixedBlog = new Blog ({
      title: 'To bug or not',
      author: 'Grace Hopper',
      url: 'http://google.com',
      likes: 18,
      __v: 0
    })
    addedone = await fixedBlog.save()
    console.log('LIsatty 1 paivitysta varten')
  })

  test('PUT /api/blogs/:id succeeds', async () => {

    const blogsBefore = await blogsInDb()

    console.log('Lisatty::: XXX', addedone._id)

    const fixUpper = {
      likes: 19
    }

    const response = await api.put(`/api/blogs/${addedone._id}`)
      .send(fixUpper)
      .expect(200)

    console.log('PUt?', fixUpper)
    const blogsAfter = await blogsInDb()

    //const contents = blogsAfter.map(r => r.url)

    expect(response.body.likes.toBe(fixUpper.likes))
    //expect(blogsAfter.length).toBe(blogsBefore.length)

  })


})
*/


afterAll (() => {
  server.close()
})




//- -------------------------
const manyblogs = [
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
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17s2',
    title: 'Readability or brevity',
    author: 'Ada Lovelace',
    url: 'http://google.com',
    likes: 8,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17AA',
    title: 'To bug or not',
    author: 'Grace Hopper',
    url: 'http://google.com',
    likes: 18,
    __v: 0
  },


]






