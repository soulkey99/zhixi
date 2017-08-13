/**
 * Created by MengLei on 2016-09-07.
 */
"use strict";
const Router = require('koa-router');
const config = require('./../../config');

let router = new Router();

router.get('/get', function*(next) {
    this.body = this.session.userID;
});

router.get('/set', function *(next) {
    this.session.user = {user: 'aaa'};
    this.session.userID = 'aaa';
    this.body = 'set';
});

router.get('/reset', function *(next) {
    this.session.user = null;
    this.session.userID = null;
    this.body = 'ok';
});

router.get('/test', function *(next) {
    this.body = 'rest2';
});

module.exports = router;
