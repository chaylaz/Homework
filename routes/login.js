/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       required: 
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: integer
 *           description: The id of the movie
 *         password:
 *           type: string
 *           description: The title of the movie
 *       example:
 *         token:
 *  
 */

const express = require('express')
const router = express()
const pool = require('../config/queries.js')
const jwt = require('jsonwebtoken')
router.post('/', (req, res) => {
    const email = req.body.email
    const password = req.body.password
    pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password], (err, result) => {
        const token = jwt.sign({ email: email, password: password, role: result.rows[0].role}, 'rahasia')
        res.json({token: token})
    })
})

module.exports = router