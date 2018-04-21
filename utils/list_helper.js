const dummy = (blogs) => {
  return 1
}



function getsum (arr) {
  return arr.reduce(function(a,b) {
    return a + b.likes
  }, 0 )
}

const totalLikes = (blogs) => {

  if (blogs.length === 1) {
    //console.log('oops', blogs)
    return blogs[0].likes
  } else {

    let sums2 = getsum(blogs)

    //console.log('testix:', sums2)

    return sums2
  }
}

const favoriteBlog = (blogs) => {

  let myMax = {}
  let maxval = -1

  blogs.forEach (
    item => {
      if (item.likes > maxval) {
        myMax = item
        maxval = item.likes
      }
    }
  )
  //console.log('Most likes at:', myMax)
  return myMax

}

const mostBlogs = (blogs) => {

  let tally = {}
  blogs.forEach (
    blog => {
      //console.log('X', blog.author)
      tally[blog.author] = (tally[blog.author] || 0 ) + 1
    }
  )

  let authors = Object.keys(tally)
  let myMax = {}
  let maxval = -1

  authors.forEach (
    item => {
      if (tally[item]> maxval) {
        myMax = { 'author': item, 'blogs': tally[item] }
        maxval = tally[item]
      }
    }
  )

  console.log('mblogs', myMax)
  return myMax
}


const mostLikes = (blogs) => {

  let tally = {}  //this time auth:likes
  blogs.forEach (
    blog => {
      tally[blog.author] = (tally[blog.author] || 0 ) + blog.likes
      //console.log('tally:', tally[blog.author])
    }
  )

  let authors = Object.keys(tally)
  let myMax = {}
  let maxval =0

  authors.forEach (
    item => {
      //console.log('ttt', item, ';',tally[item])
      if (tally[item]>= maxval) {
        myMax = { 'author': item, 'likes': tally[item] }
        maxval = tally[item]
      }
    }
  )

  console.log('mliked', myMax)
  return myMax
}



module.exports = {
  dummy ,
  totalLikes ,
  favoriteBlog ,
  mostBlogs ,
  mostLikes
}