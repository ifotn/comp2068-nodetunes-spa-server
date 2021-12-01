const express = require('express')
const router = express.Router()
const Artist = require('../models/artist')

// configure controller to allow cross-origin requests from client app (blocked by default)
const config = require('../config/globals')

// this runs for before any method in this controller
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', config.clientServer)
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    next()
})

// GET: /api/artists
router.get('/', (req, res) => {
    // fetch list of artists; return either 400 Bad Request or 200 OK along w/json response
    Artist.find({}, null, { sort: 'name' }, (err, artists) => {
        if (err) {
            console.log(err)
            res.json(err).status(400)
        }
        else {
            res.json(artists).status(200)
        }
    })
})

// POST: /api/artists => try to create new artist & return either 400 Bad Request or 201 Resource Created
router.post('/', (req, res) => {
    Artist.create(req.body, (err, artist) => {
        if (err) {
            console.log(err)
            res.json(err).status(400)
        }
        else {
            res.json(artist).status(201)
        }
    })
})

// DELETE: /api/artists/abc123 => try to delete selected artist and return either 400 or 204 No Content
router.delete('/:_id', (req, res) => {
    Artist.remove({ _id: req.params._id }, (err, artist) => {
        if (err) {
            console.log(err)
            res.json(err).status(400)
        }
        else {
            res.json(artist).status(204)
        }
    })
})

// PUT: /api/artists/abc123 => update returns 400 Bad Request or 202 Accepted
router.put('/:_id', (req, res) => {
    Artist.findByIdAndUpdate({ _id: req.params._id }, req.body, (err, artist) => {
        if (err) {
            console.log(err)
            res.json(err).status(400)
        }
        else {
            res.json(artist).status(202)
        }
    })
})

// POST /api/artists/add-album/abc123
router.post('/add-album/:_id', (req, res) => {
    // get selected artist
    Artist.findById({ _id: req.params._id }, (err, artist) => {
        if (err) {
            res.json(err).status(400)
        }
        else {
            artist.albums.push({
                title: req.body.title,
                year: req.body.year,
                rating: req.body.rating
            })
            artist.save((err, artist) => {
                if (err) {
                    res.json(err).status(400)
                }
                else {
                    res.json(artist).status(201)
                }
            })
        }
    })
})


// make public
module.exports = router