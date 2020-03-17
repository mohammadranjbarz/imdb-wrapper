const movieSchema = require('./dbAdapter').movie;

function createMovie(movie){
    return movieSchema.findOneAndUpdate(
        {"title":movie.title
        },
        movie,
        {upsert:true}

    )
}



function findMovieByTitle(movieName, year){
    const conditions ={movieName}
    if (year) {
        conditions.year = year
    }
    return movieSchema.findOne( conditions)
}



module.exports = {
    findMovieByTitle,
   createMovie

};
