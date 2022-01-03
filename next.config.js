module.exports = {
  serverRuntimeConfig: {
      secret: 'b55980e71d9cc9ff07317ad93009541c',
      otpsecret: '730247cba6085e06e9a3b9c234cc659d'
  },
  publicRuntimeConfig: {
      apiUrl: process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000/api' // development api
          : 'http://localhost:3000/api' // production api
  }
}