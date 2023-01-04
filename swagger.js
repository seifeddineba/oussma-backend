const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./routes/router.js']

swaggerAutogen(outputFile, endpointsFiles).then(() => {
    require('./app.js')
})