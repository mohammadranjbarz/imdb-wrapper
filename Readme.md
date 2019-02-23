## Installation

```$shell
git clone https://github.com/mohammadranjbar/imdb-wrapper.git
cd imdb-wrapper
npm install
```

Then go to [OMDB](http://www.omdbapi.com/) register an Api-key
then create a server-config.json with content like below, or pass
these parameters as environment variables

``` {
      "MONGO_HOST":"localhost",
       "MONGO_PORT":"27017",
       "MONGO_USERNAME":"iusername",
       "MONGO_PASSWORD":"password",
       "MONGO_DB_NAME":"imdb",
      "SERVER_POSTERS_PATH": "./posters",
       "OMDB_API_KEY": "omdb_api_key",
      "PORT":4000
    }
```

```$shell
npm start
```

## API

https://renjer-imdb.herokuapp.com/api-docs/
