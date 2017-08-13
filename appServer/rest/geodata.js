/**
 * Created by MengLei on 2016-08-31.
 */
"use strict";

const request = require('request');
const ak = require('./../../config').bd_ak;

//周边检索
exports.nearby = function *(next) {
    let body = this.request.query;
    body.page = body.page || '0';
    body.limit = body.limit || '10';
    if (!body.lng) {
        return result(this, {code: 904, msg: '请输入经度！'}, 400);
    }
    if (!body.lat) {
        return result(this, {code: 904, msg: '请输入纬度！'}, 400);
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

//本地检索，如果没传区域则根据ip定位进行查询
exports.local = function *(next) {
    let body = this.request.query;
    body.page = body.page || '0';
    body.limit = body.limit || '10';
    if (!body.region) { //如果没输入地区，则根据用户ip进行判断
        // return result(this, {code: 904, msg: '请输入区域！'}, 400);
        let qs = {
            ak,
            ip: body.ip || this.header['x-real-ip'] || this.ip,
            coor: 'bd09ll'
        };
        let opt = {
            url: 'http://api.map.baidu.com/location/ip',
            method: 'GET',
            json: true,
            qs: qs
        };
        let res = yield req(opt);
        if (res[1].status != 0) {
            return result(this, {code: 913, msg: '调用IP定位服务失败，暂时无法获取地址！' + res[1].message}, 400);
        }
        body.region = res[1].content.address_detail.city || res[1].content.address_detail.province;
    }
    let qs = {
        ak,
        geotable_id: '150745',
        region: body.region,
        page_index: body.page,
        page_size: body.limit
    };
    if (body.q) {
        qs['q'] = body.q;
    }
    let opt = {
        url: 'http://api.map.baidu.com/geosearch/v3/local',
        method: 'GET',
        json: true,
        qs: qs
    };
    let res = yield req(opt);
    return result(this, {code: 900, res: res[1]});
};

//根据ip获取坐标
exports.ip = function *(next) {
    let body = this.request.query;
    let qs = {
        ak,
        ip: body.ip || this.header['x-real-ip'] || this.ip,
        coor: 'bd09ll'
    };
    let opt = {
        url: 'http://api.map.baidu.com/location/ip',
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

