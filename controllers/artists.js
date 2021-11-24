const express = require('express')
const router = express.Router()
const Artist = require('../models/artist')

// GET: /api/artists
router.get('/', (req, res) => {
    // fetch list of artists; return either 400 Bad Request or 200 OK along w/json response
    Artist.find((err, artists) => {
        if (err) {
            console.log(err)
            res.json(err).status(400)
        }
        else {
            res.json(artists).status(200)
        }
    })
})

// make public
module.exports = router