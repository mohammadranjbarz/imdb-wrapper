'use strict';
/^([^\\/]*[\\/]).*/.test(process.cwd());
const axios = require('axios');
const path = require('path')
const imageDownloader = require('../utils/image-downloader');
const config = require('../config');
const fs = require('fs');
const postersPath = config.get('SERVER_POSTERS_PATH');
// const serverBaseAddress = config.get('SERVER_BASE_ADDRESS');
const movieAdapter = require('../db/movieAdapter');
const uuidv1 = require('uuid/v1');
let imdb = require('imdb-api');
const ROUTE_PREFIX = 'movies';
const omdbApiKey = config.get('OMDB_API_KEY')

module.exports = (app) => {
    // app.get(`/${ROUTE_PREFIX}/poster`, getPoster);
    app.get(`/${ROUTE_PREFIX}`, getMovieInfo)
    app.get(`/${ROUTE_PREFIX}/poster`, getPosterProxy)
};

function getMovieInfoFromOmdb(movieName, res) {
    return imdb.get(movieName, {apiKey: omdbApiKey, timeout: 10000}).then(function (movie) {
        console.log("movie info received ", movie.title);
        res.json(movie);
        movie.movieName = movie.title.toLowerCase();
        movieAdapter.createMovie(movie, (err, result)=> {
            if (err)
                console.log("save movie to db err  : ", err);
        });
        // return downloadCover(movie)
    }).catch(err => {
        res.status(500).send(err)
        console.log("get movie info from omdb error  : ", err);
    })

}
function getMovieInfo(req, res) {
    let movieName = req.query.title.toLowerCase();
    movieAdapter.findMovieByTitle(movieName, (err, result) => {
        if (!result) {
            return getMovieInfoFromOmdb(movieName, res);
        }
        let movie = JSON.parse(JSON.stringify(result))
        delete movie["movieName"];
        delete movie["_id"];
        delete movie["__v"];
        return res.json(movie)
    });
}
function getPosterProxy(req, res) {
    let posterLink = req.query.imageLink;
    downloadCoverAndReturnForUser(posterLink, res)
}

function downloadCoverAndReturnForUser(link, res) {
    let posterFile =postersPath+'/' +uuidv1()+".jpg";
    console.log("poster file : ", posterFile)
    if (!fs.existsSync(postersPath)) {
        fs.mkdirSync(postersPath)
    }
    if (fs.existsSync(posterFile)) {
        return res.sendFile(posterFile)
    }
    return imageDownloader.download(link, posterFile)
        .then(result => {
            console.log("result : ", result)
             res.sendFile(path.join(__dirname, "../" + posterFile.replace("./","")),{},(err,res)=>{
                console.log("error : ", err)
                fs.unlinkSync(posterFile)
            })
        })
        .catch(err => {
            res.status(500).send(err)
        })
}
