require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const MOVDEX = require('./movdex.json')

const app = express()

app.use(morgan('dev'))

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    // move to the next middleware
    next()
})

app.get('/movie', function handleGetMovie(req, res) {
    let response = MOVDEX.movie;

    // filter our pokemon by name if name query param is present
    if (req.query.genre) {
        response = response.filter(movie =>
            // case insensitive searching
            movie.genre == (req.query.genre)
        )
    }

    // filter our pokemon by type if type query param is present
    if (req.query.country) {
        response = response.filter(movie =>
            movie.country.includes(req.query.country)
        )
    }

    if (req.query.avg_vote) {
        response = response.filter(movie =>
            // case insensitive searching
            movie.avg_vote >= (req.query.avg_vote)
        )
    }

    res.json(response)
})

const PORT = 8000

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})