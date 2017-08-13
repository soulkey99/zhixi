/**
 * Created by MengLei on 2016-11-08.
 */
"use strict";
/**
 * 增加html5本地存储
 */
var util = {};
util.setSessionStorage = function (key, value) {
    if (window.sessionStorage) {
        window.sessionStorage.setItem(key, value);
        return true;
    }
    else {
        return false;
    }
};

/**
 * 获取html5本地存储
 */
util.getSessionStorage = function (key) {
    if (window.sessionStorage) {
        return window.sessionStorage.getItem(key);
    }
    else {
        return null;
    }
};

/**
 * 删除html5本地存储
 */
util.removeSessionStorage = function (key) {
    if (window.sessionStorage) {
        window.sessionStorage.removeItem(key);
        return true;
    }
    else {
        return false;
    }
};

util.parseQuery = function (search, key) {
    var re = new RegExp('(?:\\?|&)' + key + '=(.*?)(?=&|$)', 'gi');
    var r = [], m;
    while ((m = re.exec(search)) != null) r.push(m[1]);
    return r[0];
};

util.parseUrl = function (url) {
    var a = document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function () {
            var ret = {},
                seg = a.search.replace(/^\?/, '').split('&'),
                len = seg.length, i = 0, s;
            for (; i < len; i++) {
                if (!seg[i]) {
                    continue;
                }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
        segments: a.pathname.replace(/^\//, '').split('/')
    };
};

// util.restApi = function (opt, callback) {
//     $.ajax()
// }

util.ensureToken = function () {
    let access_token = window.sessionStorage.getItem('access_token');
    let expire_at = window.sessionStorage.getItem('access_token_expire');
};


