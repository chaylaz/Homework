const express = require('express')
const app = express()
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const morgan = require('morgan');
const pool = require('./config/queries.js')
const movies = require('./routes/movies.js')
const users = require('./routes/users.js')
const login = require('./routes/login.js')

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Express API with Swagger',
            version: '1.0.0',
            description: 'This is a simple CRUD API application application made with Swagger',
        },
        servers: [
            {
                url: 'http://localhost:3000'
            },
        ],
    },
        apis: ['./routes/*'],
}

const specs = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs)); 

app.use(morgan('tiny'))
app.use(express.json())
app.use('/login', login)
app.use('/movies', movies)
app.use('/users', users)
app.listen(3000,() => {
    console.log('server is running on port 3000')
})
