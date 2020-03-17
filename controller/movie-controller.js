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
const ROUTE_PREFIX = 'movies';
const omdbApiKey = config.get('OMDB_API_KEY')

module.exports = (app) => {
    // app.get(`/${ROUTE_PREFIX}/poster`, getPoster);
    app.get(`/${ROUTE_PREFIX}`, getMovieInfo)
    app.get(`/${ROUTE_PREFIX}/poster`, getPosterProxy)
};

async function getMovieInfoFromOmdb(movieName, year) {
    // const result  = imdb.get(movieName, {apiKey: omdbApiKey, timeout: 10000})
    const params = {
        apikey: omdbApiKey,
        t: movieName
    }
    if (year) {
        params.y = year
    }
    const result = await axios.get("http://www.omdbapi.com", {
        params
    })
    console.log("result of omdb", result)
    if (result.data.Response === "False") {
        throw new Error("Movie not found ")
    }
    const movie = convertAllKeysToLowerCase(result.data)
    if (movie.year !== year) {
        throw new Error("Movie with your year not found ")
    }
    movie.ratings = movie.ratings.map(item =>{
        return {
            source : item.Source,
            value :item.Value
        }
    })
    movie.movieName = movie.title.toLowerCase();
    await movieAdapter.createMovie(movie)
    return movie


}

function convertAllKeysToLowerCase(obj) {
    let key, keys = Object.keys(obj);
    let n = keys.length;
    let newobj = {}
    while (n--) {
        key = keys[n];
        newobj[key.toLowerCase()] = obj[key];
    }
    return newobj

}

async function getMovieInfo(req, res) {
    let movieName = req.query.title.toLowerCase();
    const year = req.query.year;
    try {
        const result = await movieAdapter.findMovieByTitle(movieName, year)
        if (!result) {
            const omdbResult = await getMovieInfoFromOmdb(movieName, year)
            return res.json(omdbResult)
        }
        const movie = JSON.parse(JSON.stringify(result))
        delete movie["movieName"];
        delete movie["_id"];
        delete movie["__v"];
        movie.icCached = true
        return res.json(movie)
    } catch (e) {
        console.log("getMovieInfo err", e)

        res.status(500).json({message:e.message})
    }

}

function getPosterProxy(req, res) {
    let posterLink = req.query.imageLink;
    downloadCoverAndReturnForUser(posterLink, res)
}

function downloadCoverAndReturnForUser(link, res) {
    let posterFile = postersPath + '/' + uuidv1() + ".jpg";
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
            res.sendFile(path.join(__dirname, "../" + posterFile.replace("./", "")), {}, (err, res) => {
                console.log("error : ", err)
                fs.unlinkSync(posterFile)
            })
        })
        .catch(err => {
            res.status(500).send(err)
        })
}
