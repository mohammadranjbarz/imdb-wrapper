'use strict';

const app = require('express')();
const bodyParser = require('body-parser');
const config = require('./config');
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('./swagger.json');

// Because production environment support ssl we should scheme of swaggerData to https to can load that in production
if (process.env.NODE_ENVIRONMENT === 'production') {
    swaggerDocument.schemes = ['https'];
}
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const boom = require('express-boom');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(boom());
app.disable('x-powered-by');
const PORT = config.get('PORT');

// Include resources. Edit resources.js to include any resource you want
require('./controller/movie-controller')(app);

app.listen(PORT);
console.log('listening to port ', PORT, ' ...');