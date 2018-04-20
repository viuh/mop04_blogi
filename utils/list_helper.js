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

module.exports = {
  dummy ,
  totalLikes
}