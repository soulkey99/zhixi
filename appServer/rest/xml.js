/**
 * Created by MengLei on 2016-11-10.
 */
"use strict";
const Router = require('koa-router');
const weixin = require('./weixin');

let router = new Router();

router.get('/wx/webhook', weixin.echo);
router.post('/wx/webhook', weixin.webhook);   //微信消息回调，xml格式

module.exports = router;
