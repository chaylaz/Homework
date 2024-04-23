/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required: 
 *         - id
 *         - email
 *         - gender
 *         - password
 *         - role
 *       properties:
 *         id:
 *           type: integer
 *           description: The id of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         gender:
 *           type: string
 *           description: The gender of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         role: 
 *           type: string
 *           description: The role of the user
 *       example:
 *         id: 1
 *         email: oainger0@craigslist.org
 *         gender: female
 *         password: KcAk6Mrg7DRM
 *         role: Construction Worker
 */


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The Users API
 * /users:
 *    post:
 *      summary: Creates a new Users
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        200:
 *          description: The created user
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        500:
 *          description: Some server error
 * 
 */


const express = require('express')
const router = express()
const pool = require('../config/queries.js')
const jwt = require('jsonwebtoken')

router.get('/', (req, res) => {
    if(!req.body.token){
        res.send({message: 'Token missing'})
    }

    const data = jwt.verify(req.body.token,'rahasia')
    if (!req.query.page && !req.query.limit){
      res.send({message: 'Page and limit missing'})
    }
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const offset = (page - 1) * limit
    pool.query(`select id, email, gender, role from users order by id asc offset ${offset} limit ${limit}`, (error, result) => {
      res.json(result.rows)
    })
  })

  router.post('/create', (req, res) => {
    if(!req.body.token){
        res.send({message: 'Token missing'})
    }

    const data = jwt.verify(req.body.token,'rahasia')
    pool.query(`insert into users (id, email, gender, password, role) values (${req.body.id}, '${req.body.email}', '${req.body.gender}', '${req.body.password}', '${req.body.role}')`, (error, result) => {
      res.send({message: 'Success'})
    })
  })

  router.put('/edit/:id', (req, res) => {
    if(!req.body.token){
        res.send({message: 'Token missing'})
    }

    const data = jwt.verify(req.body.token,'rahasia')
    pool.query(`update users set email = '${req.body.email}', gender = '${req.body.gender}', password = '${req.body.password}', role = '${req.body.role}' where id = ${req.params.id}`, (error, result) => {
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
    pool.query(`delete from users where id = ${req.params.id}`, (error, result) => {
      res.send({message: 'Success'})
    })
  
});

module.exports = router;