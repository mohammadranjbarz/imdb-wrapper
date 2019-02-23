const movieSchema = require('./dbAdapter').movie;

function createMovie(movie, callback){
    movieSchema.findOneAndUpdate(
        {"title":movie.title
        },
        movie,
        {upsert:true}

    ).exec(callback)
}



function findMovieByTitle(movieName,  callback){
    movieSchema.findOne( { movieName} , callback)
}



module.exports = {
    findMovieByTitle,
   createMovie

};
