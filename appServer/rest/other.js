/**
 * Created by MengLei on 2016-08-30.
 */
"use strict";
const request = require('request');
const ak = require('./../../config').bd_ak;

exports.nearby = function *(next) {
    let body = this.request.query;
    body.page = body.page || '0';
    body.limit = body.limit || '10';
    if (!body.lng) {
        return result(this, {code: 904, msg: '请输入经度！'});
    }
    if (!body.lat) {
        return result(this, {code: 904, msg: '请输入纬度！'});
    }
    let qs = {
        ak,
        geotable_id: '150745',
        radius: body.radius || '1000',
        page_index: body.page,
        page_size: body.limit,
        location: body.lng + ',' + body.lat
    };
    if (body.q) {
        qs['q'] = body.q;
    }
    let opt = {
        url: 'http://api.map.baidu.com/geosearch/v3/nearby',
        method: 'GET',
        json: true,
        qs: qs
    };
    let res = yield req(opt);
    return result(this, {code: 900, res: res[1]});
};

function req(opt, callback) {   //thunkify request
    return function (callback) {
        request(opt, callback)
    }
}

