/**
 * Created by MengLei on 2016-08-30.
 */
"use strict";

//普通用户的验证，用户名密码分别为userID和authSign
exports.auth = function *(next) {
    let u = this.request.body.username;
    let p = this.request.body.password;
    // console.log('auth');
    if (validator.isMongoId(u)) {
        let user = yield proxy.User.getUserById(u);
        if (user && user.authSign == p) {
            return result(this, 'OK');
        }
    }
};

//对超级用户的验证，验证用户名：byzhixi
exports.superuser = function *(next) {
    if (this.request.body.username == 'byzhixi') {
        this.status = 200;
        this.body = 'OK';
    } else {
        this.status = 404;
        this.body = 'No';
    }
};

//access control，不校验，仅返回ok
exports.acl = function *(next) {
    this.status = 200;
    this.body = 'OK';
};
