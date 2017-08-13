/**
 * Created by MengLei on 2016-09-08.
 */
"use strict";
const app = require('koa')();
const http = require('http');
const router = require('koa-router')();
const rest = require('./rest');
const rest2 = require('./rest2');

router.use('/rest', require('koa-body')(), rest.routes()); //main route
router.use('/rest2', require('koa-body')(), rest2.routes()); //main route
app.use(router.routes());

http.createServer(app.callback()).listen(3000);
