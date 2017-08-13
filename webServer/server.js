/**
 * Created by MengLei on 2016-11-14.
 */
"use strict";
const http = require('http');
const config = require('./../config');
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});


let server = http.createServer((req, res)=> {
    let url = req.url;
    if (url.indexOf('webrest') > 0) {
        proxy.web(req, res, {target: 'http://123.57.16.157:8051'});
        // proxy.web(req, res, {target: 'http://127.0.0.1:8051'});
    } else {
        proxy.web(req, res, {target: 'http://127.0.0.1:4200'});
    }
}).listen(config.port.web, err=> {
    if (err) {
        return console.log(`web dev proxy server init error: ${err.message}`);
    }
    console.log(`web dev proxy server listening at port: ${config.port.web}`);
});

