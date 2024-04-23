/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       required: 
 *         - id
 *         - title
 *         - genres
 *         - year
 *       properties:
 *         id:
 *           type: integer
 *           description: The id of the movie
 *         title:
 *           type: string
 *           description: The title of the movie
 *         genres:
 *           type: string
 *           description: The genres of the movie
 *         year:
 *           type: string
 *           description: The year of the movie
 *       example:
 *         id: 1
 *         title: Reckless
 *         genres: Comedy|Drama|Romance
 *         year: 2001
 */

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: The Movies API
 * /movies:
 *    post:
 *      summary: Creates a new Movie
 *      tags: [Movies]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Movie'
 *      responses:
 *        200:
 *          description: The created movie
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Movie'
 *        500:
 *          description: Some server error
 * 
 */

const express = require('express')
const router = express()
const pool = require('../config/queries.js')

router.get('/', (req, res) => {
    if (!req.query.page && !req.query.limit){
      res.send({message: 'Page and limit missing'})
    }

    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const offset = (page - 1) * limit
    pool.query(`select * from movies order by id asc offset ${offset} limit ${limit}`, (error, result) => {
        // console.log(result)
      res.json(result.rows)
    })
  })

router.post('/create', (req, res) => {
    if(!req.body.token){
        res.send({message: 'Token missing'})
    }

    const data = jwt.verify(req.body.token,'rahasia')
    pool.query(`insert into movies (id, title, genres, year) values (${req.body.id}, '${req.body.title}', '${req.body.genres}', '${req.body.year}')`, (error, result) => {
      res.send({message: 'Success'})
    })
  })

  router.put('/edit/:id', (req, res) => {
    if(!req.body.token){
        res.send({message: 'Token missing'})
    }

    const data = jwt.verify(req.body.token,'rahasia')
    pool.query(`update movies set title = '${req.body.title}', genres = '${req.body.genres}', year = '${req.body.year}' where id = ${req.params.id}`, (error, result) => {
      res.send({message: 'Success'})
    })
  })

router.delete('/delete/:id', (req, res) => {
    if(!req.body.token){
        res.send({message: 'Token missing'})
    }

    const data = jwt.verify(req.body.token,'rahasia')
    const role = data.role
    if (role != "Construction Worker"){
        res.send({message: 'Unauthorized'})
    }
    pool.query(`delete from movies where id = ${req.params.id}`, (error, result) => {
      res.send({message: 'Success'})
    })
  
});


module.exports = router;