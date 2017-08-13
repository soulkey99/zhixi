/**
 * Created by MengLei on 2016-09-08.
 */
"use strict";
const model = require('./../../model');

/**
 * 根据用户userID和用户userType来获取用户记录
 * @param {String} id  userID
 * @param {String} type  userType
 * @returns {*}
 */
exports.getUserById = function *(id, type) {
    let user = null;
    switch (type) {
        case 's':
            user = yield model.UserS.findById(id);
            break;
        case 't':
            user = yield model.UserT.findById(id);
            break;
        case 'p':
            user = yield model.UserP.findById(id);
            break;
    }
    return user;
};
