'use strict';

const Promise = require('bluebird'),
    fs = Promise.promisifyAll(require('fs')),
    requestAsync = Promise.promisify(require('request')),
    path = require('path');


module.exports = {
    download
};

function download(url, dest) {
    return requestAsync({url: url, encoding: null})
        .then((result) => {
            if (!path.extname(dest)) {
                dest = path.join(dest, path.basename(url));
            }

            return fs.writeFileAsync(dest, result.body, 'binary');
        })
        .catch(err => {
            console.log('download image error : ', err);
            return Promise.reject({message: 'download image error'});
        })
}