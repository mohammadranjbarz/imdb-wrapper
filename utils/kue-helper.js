var image_downloader = require('image-downloader');
var fs = require('fs');
var jsonfile = require('jsonfile');
var kue = require('kue')
    , queue = kue.createQueue();

module.exports = {
    createJob
};

queue.watchStuckJobs(1000 * 10);

queue.on('ready', () => {
    console.info('Queue is ready!');
});

queue.on('error', (err) => {
    console.error('There was an error in the main queue!');
console.error(err);
console.error(err.stack);
});


/**
 * the done method is necessary for kue to know that previous task is done.
 */
// Process up to 20 jobs concurrently
queue.process('poster', 20, function (job, done) {
    // other processing work here
    // ...
    // ...
    downloadPoster(job, done);

});

function downloadPoster(job, done){
    options = {
        url: job.data.url,
        dest:job.data.dest,        // Save to /path/to/dest/photo.jpg
        done: function(err, filename, image) {
            done();
            if (err) {
                console.log('downloading poster error : ', err);
                // return;
            }else {
                console.log('File saved to', job.data.dest, 'filename : ', filename);
            }


        },
    };
    console.log('options : ' ,  options);
    image_downloader(options);
}

function createJob(data) {
    queue.create(data.jobType, data)
        .priority('normal')
        .removeOnComplete(true)
        .save(err => {
        if (err) {
            console.error(err);
        }
        if (!err) {
        console.log('job saved : ', data.jobType);
    }
});
}
