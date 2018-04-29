
const logger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const error = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {

    //console.log('TOKEN GOT', authorization.substring(7))
    request.token =  authorization.substring(7)
  } else {
  //return null
    request.token = null
  }

  next()
}



module.exports = {
  logger,
  error,
  tokenExtractor
}
