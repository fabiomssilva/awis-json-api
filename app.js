const express = require('express');
const aws4 = require('aws4');
const https = require('https');
const xml2js = require('xml2js');

const app = express();

app.get('/', (req, res) => {
    res.send('AWIS Json API');
});

app.get('*', (req, res) => {
    const path = req.originalUrl;

    const opts = {
        service: 'awis',
        region: 'us-west-1',
        host: 'awis.us-west-1.amazonaws.com',
        path,
    };

    aws4.sign(opts);
    https.get(opts, (r) => {
        let body = '';

        r.on('data', (chunk) => {
            body += chunk;
        });

        r.on('end', () => {
            xml2js.parseString(body, (err, result) => {
                console.log('Error: ', err);
                console.log(result);
            });
        });
    }).on('error', (e) => {
        console.log('Got an error: ', e);
    });

    res.send('AWIS Json API *');
});

module.exports = app;