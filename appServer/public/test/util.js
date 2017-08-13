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

// util.restApi = function (opt, callback) {
//     $.ajax()
// }

util.ensureToken = function () {
    let access_token = window.sessionStorage.getItem('access_token');
    let expire_at = window.sessionStorage.getItem('access_token_expire');
};


