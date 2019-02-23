const mongoose = require('mongoose');
const config = require('../config');

const mongoHost = config.get('MONGO_HOST')
const mongoPort = config.get('MONGO_PORT')
const mongoUsername = config.get('MONGO_USERNAME')
const mongoPassword = config.get('MONGO_PASSWORD')
const dbName = config.get('MONGO_DB_NAME')
let mongoUri = `mongodb://${mongoHost}:${mongoPort}/${dbName}`
if (mongoUsername) {
    mongoUri = `mongodb://${mongoUsername}:${mongoPassword}@${mongoHost}:${mongoPort}/${dbName}`
}
mongoose.connect(mongoUri);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error...'));
db.once('open', function () {
    console.log('db opened...');
});
db.once('connect', function () {
    console.log('db connected...');
});
db.once('discconnect', function () {
    console.log('db discconnected...');
});
let movieSchema = new mongoose.Schema({
    "movieName": String,
    "title": String,
    "_year_data": String,
    "year": Number,
    "rated": String,
    "released": String,
    "runtime": String,
    "genres": String,
    "director": String,
    "writer": String,
    "actors": String,
    "plot": String,
    "languages": String,
    "country": String,
    "awards": String,
    "poster": String,
    "originalPoster": String,
    "ratings": Array,
    "metascore": String,
    "rating": String,
    "votes": String,
    "imdbid": String,
    "type": String,
    "boxoffice": String,
    "production": String,
    "website": String,
    "series": String,
    "imdburl": String
})

module.exports = {
    movie: mongoose.model('movie', movieSchema, 'movie')
};
