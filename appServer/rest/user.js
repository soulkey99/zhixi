/**
 * Created by MengLei on 2016-08-26.
 */
"use strict";
const crypto = require('crypto');
const wxUtil = require('../utils/weixin');
const redis = require('./../../config').redis;
const sms = require('../../utils/sms');

//在根据this.state.userID获取用户信息并挂载到this.state上
exports.stateUser = function *(next) {
    let user = null;
    //视具体情况获取userID，如果state上有userID，那么肯定用户已登录，直接取这个ID，否则看body中是否存在userID，如果有那么取该ID，如果都没有，那么返回错误！
    let userID = this.state.userID || this.request.body.userID;
    if (!userID) {
        return result(this, {code: 904, msg: '没有userID，无法获取用户信息！'}, 400);
    }
    if (!validator.isMongoId(userID)) {
        return result(this, {code: 904, msg: 'userID格式不正确，无法获取用户信息！'}, 400);
    }
    switch (this.params.userType) {
        case 't': {
            user = yield proxy.Teacher.getUserById(userID);
        }
            break;
        case 's': {
            user = yield proxy.Student.getUserById(userID);
        }
            break;
        case 'p': {
            user = yield proxy.Parent.getUserById(userID);
        }
            break;
        default: {
            return result(this, {code: 911, msg: '客户端类型不存在！'}, 404);
        }
            break;
    }
    this.state.user = user;
    yield next;
};

//用户登录之前校验密码或者验证码
exports.checkLogin = function *(next) {
    let body = this.request.body;
    let user = null;
    if (!body.phone) {
        return result(this, {code: 904, msg: '缺少手机号参数！'}, 400);
    }
    //db log
    let loginInfo = {
        channel: this.header.channel || '',
        client: this.header.client || '',
        platform: (this.header.platform || '').toLowerCase(),
        imei: this.header.u || '',
        mac: this.header.w || '',
        ip: this.header['x-real-ip'] || this.ip
    };
    switch (this.params.userType) {
        case 't':
            loginInfo.userType = 'teacher';
            user = yield proxy.Teacher.getUserByPhone(body.phone);
            break;
        case 's':
            loginInfo.userType = 'student';
            user = yield proxy.Student.getUserByPhone(body.phone);
            break;
        case 'p':
            loginInfo.userType = 'parent';
            user = yield proxy.Parent.getUserByPhone(body.phone);
            break;
        default:
            return result(this, {code: 911, msg: '不存在的客户端类型！'}, 404);
            break;
    }
    if (!user) {
        return result(this, {code: 902, msg: '用户不存在！'}, 404);
    }
    if (body.smscode) {
        let res = yield sms.check(body.phone, body.smscode);
        loginInfo.type = 'smscode';
        if (res.code) {
            return result(this, {code: res.code, msg: res.error || '短信验证码校验失败！'}, 400);
        }
    } else if (body.passwd) {
        loginInfo.type = 'passwd';
        if (!user.passwd) {
            return result(this, {code: 907, msg: '用户尚未设置登录密码，请使用短信登陆！'}, 400);
        }
        if (user.passwd != body.passwd) {
            return result(this, {code: 906, msg: '用户密码错误！'}, 400);
        }
    } else {
        return result(this, {code: 904, msg: '缺少smscode或者passwd字段！'}, 400);
    }
    let sessionParam = {
        userID: user.userID,
        userType: this.params.userType,
        type: '',
        device: body.device,
        loginType: 'user'
    };
    if (this.header.platform && (this.header.platform.toLowerCase() == 'android' || this.header.platform.toLowerCase() == 'ios')) {
        sessionParam.type = 'mobile';
    } else if (this.header.platform && this.header.platform.toLowerCase() == 'web') {
        this.session.user = user.toInfo();
        this.session.userType = this.params.userType;
        this.session.userID = user.userID;
        sessionParam.type = 'web';
    } else {
        sessionParam.type = 'unknown';
    }
    //校验全部通过，可以登录，创建新session
    this.state.user = user;
    this.state.session = yield proxy.UserSession.create(sessionParam);
    proxy.Log.userLog({userID: user.userID, action: 'login', content: loginInfo});
    yield next;
};

//执行自动登陆、注销校验auth
exports.checkAuth = function *(next) {
    let body = this.request.body;
    let user = null;
    if (!body.userID) {
        return result(this, {code: 904, message: 'userID缺失！'}, 400);
    }
    if (!validator.isMongoId(body.userID)) {
        return result(this, {code: 904, message: 'userID格式不正确！'}, 400);
    }
    //db log
    let loginInfo = {
        channel: this.header.channel || '',
        client: this.header.client || '',
        platform: (this.header.platform || '').toLowerCase(),
        imei: this.header.u || '',
        mac: this.header.w || '',
        ip: this.header['x-real-ip'] || this.ip
    };
    switch (this.params.userType) {
        case 't':
            loginInfo.userType = 'teacher';
            user = yield proxy.Teacher.getUserById(body.userID);
            break;
        case 's':
            loginInfo.userType = 'student';
            user = yield proxy.Student.getUserById(body.userID);
            break;
        case 'p':
            loginInfo.userType = 'parent';
            user = yield proxy.Parent.getUserById(body.userID);
            break;
        default:
            return result(this, {code: 911, msg: '不存在的客户端类型！'}, 404);
            break;
    }
    if (!user) {
        return result(this, {code: 902, msg: '用户不存在！'}, 404);
    }
    if (user.authSign != this.request.body.authSign) {
        return result(this, {code: 903, msg: '登陆信息失效，请重新登陆！'}, 400);
    }
    this.state.user = user;
    let log = {userID: user.userID, action: 'autoLogin', content: loginInfo};
    if (this.path.indexOf('logout') > 0) {
        log.action = 'logout';
    }
    proxy.Log.userLog(log);
    yield next;
};

//执行自动登陆、注销校验session
exports.checkSession = function *(next) {
    let body = this.request.body;
    let user = null;
    if (!body.session_id) {
        return result(this, {code: 904, message: 'session_id缺失！'}, 400);
    }
    if (!validator.isMongoId(body.session_id)) {
        return result(this, {code: 904, message: 'session_id格式不正确！'}, 400);
    }
    if (!body.userID) {
        return result(this, {code: 904, message: 'userID缺失！'}, 400);
    }
    if (!validator.isMongoId(body.userID)) {
        return result(this, {code: 904, message: 'userID格式不正确！'}, 400);
    }
    //db log
    let loginInfo = {
        channel: this.header.channel || '',
        client: this.header.client || '',
        platform: (this.header.platform || '').toLowerCase(),
        imei: this.header.u || '',
        mac: this.header.w || '',
        device: this.body.device || '',
        ip: this.header['x-real-ip'] || this.ip
    };
    let session = yield proxy.UserSession.getSessionByID(body.session_id);
    if (!(session && session.valid)) {
        return result(this, {code: 903, msg: '登陆信息无效，请重新登陆！'}, 400);
    }
    if (session.userID.toString() != body.userID) {
        return result(this, {code: 903, msg: '登陆信息无效，请重新登陆！'}, 400);
    }
    switch (this.params.userType) {
        case 't':
            loginInfo.userType = 'teacher';
            user = yield proxy.Teacher.getUserById(body.userID);
            break;
        case 's':
            loginInfo.userType = 'student';
            user = yield proxy.Student.getUserById(body.userID);
            break;
        case 'p':
            loginInfo.userType = 'parent';
            user = yield proxy.Parent.getUserById(body.userID);
            break;
        default:
            return result(this, {code: 911, msg: '不存在的客户端类型！'}, 404);
            break;
    }
    if (!user) {
        return result(this, {code: 902, msg: '用户不存在！'}, 404);
    }
    this.state.user = user;
    this.state.session = session;
    let log = {userID: user.userID, action: 'autoLogin', content: loginInfo};
    if (this.path.indexOf('logout') > 0) {
        log.action = 'logout';
    }
    proxy.Log.userLog(log);
    yield next;
};

//执行sso信息校验
exports.checkSSO = function *(next) {
    let body = this.request.body;
    if (!body.openid) {
        return result(this, {code: 904, message: '参数openid缺失！'}, 400);
    }
    if (!body.access_token) {
        return result(this, {code: 904, message: '参数access_token缺失！'}, 400);
    }
    switch (body.ssoType) {
        case 'weixin':
        case 'wxauth': {
            let check = yield wxUtil.checkUser(body.openid, body.access_token);
            // check.valid = true;
            // check.unionid = 'oqypLuNmToIwXCL01t2hUmS8e2N0';
            if (!check.valid) {
                return result(this, {code: 913, msg: '第三方登录信息无效！'}, 400);
            }
            body.nick = check.nick;
            body.openid = check.openid;
            body.avatar = check.avatar;
            body.unionid = check.unionid;
        }
            break;
        case 'weibo':
        case 'qq':
            break;
        default:
            return result(this, {code: 904, msg: 'ssoType参数错误！'}, 400);
            break;
    }
    let sso = null;
    let user = null;
    switch (this.params.userType) {
        case 't':
            break;
        case 's': {
            sso = yield proxy.Student.getSSOByOpenID(body);
            if (!sso) {
                user = yield proxy.Student.createUser({nick: body.nick, avatar: body.avatar});
                sso = yield proxy.Student.createSSO({
                    userID: user.userID,
                    ssoType: body.ssoType,
                    openid: body.openid,
                    nick: body.nick,
                    avatar: body.avatar,
                    unionid: body.unionid,
                    access_token: body.access_token,
                    refresh_token: body.refresh_token,
                });
            } else {
                user = yield proxy.Student.getUserById(sso.userID);
            }
        }
            break;
        case 'p': {
            sso = yield proxy.Parent.getSSOByOpenID(body);
            if (!sso) {
                user = yield proxy.Parent.createUser({nick: body.nick, avatar: body.avatar});
                sso = yield proxy.Parent.createSSO({
                    userID: user.userID,
                    ssoType: body.ssoType,
                    openid: body.openid,
                    nick: body.nick,
                    avatar: body.avatar,
                    unionid: body.unionid,
                    access_token: body.access_token,
                    refresh_token: body.refresh_token,
                });
            } else {
                user = yield proxy.Parent.getUserById(sso.userID);
            }
        }
            break;
        default: {
            return result(this, {code: 911, msg: '不存在的客户端类型！'}, 404);
        }
            break;
    }
    let sessionParam = {    //创建新session需要的各种参数
        userID: user.userID,
        userType: this.params.userType,
        type: '',
        device: body.device,
        loginType: 'sso'
    };
    if (this.header.platform && (this.header.platform.toLowerCase() == 'android' || this.header.platform.toLowerCase() == 'ios')) {
        sessionParam.type = 'mobile';
    } else if (this.header.platform && this.header.platform.toLowerCase() == 'web') {
        sessionParam.type = 'web';
    } else if (this.header.platform && this.header.platform.toLowerCase() == 'wxweb') {
        sessionParam.type = 'wxweb';
    } else {
        sessionParam.type = 'unknown';
    }
    //校验全部通过，可以登录，创建新session
    this.state.user = user;
    this.state.session = yield proxy.UserSession.create(sessionParam);
    yield next;
};


//普通用户注册
exports.checkReg = function *(next) {
    let body = this.request.body;
    if (!body.phone) {
        return result(this, {code: 904, msg: '缺少手机号参数！'}, 400);
    }
    if (!body.smscode) {
        return result(this, {code: 904, msg: '缺少短信验证码参数！'}, 400);
    }
    let res = yield sms.check(body.phone, body.smscode);
    if (res.code) {
        return result(res, {code: res.code, msg: res.error || '短信验证码校验失败！'}, 400);
    }
    let user = null;
    switch (this.params.userType) {
        case 't': {
            user = yield proxy.Teacher.getUserByPhone(body.phone);
        }
            break;
        case 's': {
            user = yield proxy.Student.getUserByPhone(body.phone);
        }
            break;
        case 'p': {
            user = yield proxy.Parent.getUserByPhone(body.phone);
        }
            break;
        default: {
            return result(this, {code: 911, msg: '不存在的客户端类型！'}, 404);
        }
            break;
    }
    if (user) {
        return result(this, {code: 901, msg: '用户已存在，请登录！'}, 400);
    }
    yield next;
};

//游客注册
exports.guestReg = function *(next) {
    this.request.body.type = 'guest';
    yield next;
};

//执行注册创建用户的操作
exports.doRegister = function *(next) {
    let body = this.request.body;
    let user = null;
    let param = {};
    if (body.phone) {
        param['phone'] = body.phone;
    }
    if (body.nick) {
        param['nick'] = body.nick;
    }
    if (body.avatar) {
        param['avatar'] = body.avatar;
    }
    if (body.passwd) {
        param['passwd'] = body.passwd;
    }
    if (body.type == 'guest') {
        param['type'] = 'guest';
    }
    //db log
    let loginInfo = {
        channel: this.header.channel || '',
        client: this.header.client || '',
        platform: (this.header.platform || '').toLowerCase(),
        imei: this.header.u || '',
        mac: this.header.w || '',
        isGuest: param.type == 'guest',
        ip: this.header['x-real-ip'] || this.ip
    };
    switch (this.params.userType) {
        case 't': {
            loginInfo.userType = 'teacher';
            user = yield proxy.Teacher.createUser(param);
            //创建教师账号之后，要立刻为这位教师创建一个默认学校
            yield proxy.School.createSchool({
                master_id: user.userID
            })
        }
            break;
        case 's': {
            loginInfo.userType = 'student';
            user = yield proxy.Student.createUser(param);
        }
            break;
        case 'p': {
            loginInfo.userType = 'parent';
            user = yield proxy.Parent.createUser(param);
        }
            break;
        default: {
            return result(this, {code: 911, msg: '不存在的客户端类型！'}, 404);
        }
            break;
    }
    let sessionParam = {    //创建新session需要的各种参数
        userID: user.userID,
        userType: this.params.userType,
        type: '',
        device: body.device,
        loginType: body.type || 'user'
    };
    if (this.header.platform && (this.header.platform.toLowerCase() == 'android' || this.header.platform.toLowerCase() == 'ios')) {
        sessionParam.type = 'mobile';
    } else if (this.header.platform && this.header.platform.toLowerCase() == 'web') {
        sessionParam.type = 'web';
    } else {
        sessionParam.type = 'unknown';
    }
    //校验全部通过，可以登录，创建新session
    this.state.user = user;
    this.state.userID = user.userID;
    this.state.session = yield proxy.UserSession.create(sessionParam);
    proxy.Log.userLog({userID: user.userID, action: 'register', content: loginInfo});
    yield next;
};

//校验密码、验证码、sso等信息成功之后，执行统一的登录逻辑
exports.doLogin = function *(next) {
    let user = this.state.user;
    let session = this.state.session;
    if (user.block_util && user.block_util > Date.now()) {
        return result(this, {code: 909, msg: '用户被封禁，无法登陆！'}, 400);
    }
    let info = user.toInfo();
    info.has_passwd = !!user.passwd;  //如果第三方登录通过，那么接口强制返回true
    info.access_token = session.access_token;
    info.access_token_expire = Math.round((session.access_token_expire - Date.now()) / 1000) * 1000;
    info.refresh_token = session.refresh_token;
    info.refresh_token_expire = Math.round((session.refresh_token_expire - Date.now()) / 1000) * 1000;
    // yield proxy.MqttUser.onLogin({userID: user.userID, platform: this.header['platform'].toLowerCase()});
    this.state.userID = user.userID;
    return result(this, {code: 900, info});
};

//注销
exports.doLogout = function *(next) {
    let session = this.state.session;
    this.state.userID = session.userID;
    session.valid = false;
    yield [
        session.save(),
        redis.del(`SKZhixi:AppServer:RestSession:${session.access_token}`)
    ];
    return result(this, {code: 900});
};

//校验access_token或者refresh_token有效性
exports.checkToken = function *(next) {
    let body = this.request.query;
    if (this.method == 'POST') {
        body = this.request.body;
    }
    if (body.access_token) {
        let session = yield proxy.UserSession.getSession({access_token: body.access_token});
        if (!session) {
            return result(this, {code: 903, msg: 'access_token无效！'}, 400);
        }
        if (!session.valid) {
            let nextSession = yield proxy.UserSession.getNextSession({access_token: body.access_token});
            let ret = {code: 903, msg: 'access_token无效！'};
            if (nextSession) {
                ret.nextDevice = nextSession.device;
                ret.nextLogin = nextSession.createdAt;
            }
            return result(this, ret, 400);
        }
        if (new Date(session.access_token_expire) < Date.now()) {
            return result(this, {code: 899, msg: '您的access_token已经超时！'}, 400);
        }
        this.state.session = session;
        yield next;
    } else if (body.refresh_token) {
        let session = yield proxy.UserSession.getSession({refresh_token: body.refresh_token});
        if (!session) {
            return result(this, {code: 903, msg: 'refresh_token无效！'}, 400);
        }
        if (!session.valid) {
            let nextSession = yield proxy.UserSession.getNextSession({access_token: body.access_token});
            let ret = {code: 903, msg: 'refresh_token无效！'};
            if (nextSession) {
                ret.nextDevice = nextSession.device;
                ret.nextLogin = nextSession.createdAt;
            }
            return result(this, ret, 400);
        }
        if (new Date(session.refresh_token_expire) < Date.now()) {
            return result(this, {code: 899, msg: '您的refresh_token已经超时！'}, 400);
        }
        this.state.session = session;
        yield next;
    } else {
        return result(this, {code: 904, msg: '缺少access_token或者refresh_token参数！'}, 400);
    }
};

//返回session中两个token的有效期
exports.getExpireInfo = function *(next) {
    let session = this.state.session;
    return result(this, {
        code: 900,
        access_token_expire: Math.round((session.access_token_expire - Date.now()) / 1000) * 1000,
        refresh_token_expire: Math.round((session.refresh_token_expire - Date.now()) / 1000) * 1000
    });
};

//刷新access_token
exports.doRefreshAccessToken = function *(next) {
    let session = this.state.session;
    yield redis.expire(`SKZhixi:AppServer:RestSession:${session.access_token}`, 15);//15秒的buffer，两个access_token都好用
    session.access_token = crypto.randomBytes(24).toString('hex');
    session.access_token_expire = new Date(Date.now() + 7200000);    //设置7200秒有效期
    yield session.save();
    this.state.userID = session.userID;
    return result(this, {
        code: 900,
        access_token: session.access_token,
        access_token_expire: Math.round((session.access_token_expire - Date.now()) / 1000) * 1000
    });
};

//刷新refresh_token
exports.doRefreshRefreshToken = function *(next) {
    let session = this.state.session;
    session.refresh_token = crypto.randomBytes(24).toString('hex');
    if (session.loginType == 'guest') {
        session.refresh_token_expire = new Date(Date.now() + 31536000000);//游客登陆有效期一年
    } else {
        session.refresh_token_expire = new Date(Date.now() + 2592000000); //普通用户有效期30天
    }
    yield session.save();
    this.state.userID = session.userID;
    return result(this, {
        code: 900,
        refresh_token: session.refresh_token,
        refresh_token_expire: Math.round((session.refresh_token_expire - Date.now()) / 1000) * 1000
    });
};

//校验输入的手机号是否正确
exports.checkPhone = function *(next) {
    let user = this.state.user;
    if (!user) {
        return result(this, {code: 902, msg: '用户不存在！'}, 400);
    }
    if (user.phone != this.request.body.phone) {
        return result(this, {code: 904, msg: '手机号填写错误！'}, 400)
    }
    let res = yield sms.send({phone: user.phone});
    if (res.code) {
        return result(this, {code: res.code, msg: res.error || '获取短信验证码失败！'}, res[0].statusCode);
    }
    return result(this, {code: 900});
};

//校验短信验证码
exports.checkSMS = function *(next) {
    let user = this.state.user;
    if (!user) {
        return result(this, {code: 902, msg: '用户不存在！'}, 400);
    }
    if (!this.request.body.smscode) {
        return result(this, {code: 904, msg: '请输入短信验证码！'}, 400);
    }
    let res = yield sms.check(user.phone, this.request.body.smscode);
    if (res.code) {
        return result(res, {code: res.code, msg: res.error || '短信验证码校验失败！'}, 400);
    }
    return result(this, {code: 900});
};

//重置密码
exports.resetPwd = function *(next) {
    let user = null;
    switch (this.params.userType) {
        case 't': {
            user = yield proxy.Teacher.getUserByPhone(this.request.body.phone);
        }
            break;
        case 's': {
            user = yield proxy.Student.getUserByPhone(this.request.body.phone);
        }
            break;
        case 'p': {
            user = yield proxy.Parent.getUserByPhone(this.request.body.phone);
        }
            break;
        default: {
            return result(this, {code: 911, msg: '客户端类型不存在！'}, 404);
        }
            break;
    }
    if (!user) {
        return result(this, {code: 902, msg: '用户不存在！'}, 404);
    }
    user = yield user.setPwd(this.request.body.newPwd);
    return result(this, {code: 900, userID: user.userID});
};

//修改密码
exports.changePwd = function *(next) {
    let user = this.state.user;
    if (this.request.body.oldPwd != user.passwd) {
        return result(this, {code: 906, msg: '用户旧密码错误！'});
    }
    yield user.setPwd(this.request.body.newPwd);
    return result(this, {code: 900, userID: user.userID});
};

//获取用户本人的信息
exports.getInfo = function *(next) {
    let user = null;
    switch (this.params.userType) {
        case 't':
            user = yield proxy.Teacher.getUserById(this.state.userID);
            break;
        case 's':
            user = yield proxy.Student.getUserById(this.state.userID);
            break;
        case 'p':
            user = yield proxy.Parent.getUserById(this.state.userID);
            break;
        default:
            return result(this, {code: 911, msg: '不存在的客户端类型！'}, 404);
            break;
    }
    if (!user) {
        return result(this, {code: 902, msg: '用户不存在！'}, 404);
    }
    return result(this, {code: 900, info: user.toInfo()});
};

//修改用户信息
exports.setInfo = function *(next) {
    let param = this.request.body;
    param['userID'] = this.state.userID;
    delete(param.passwd);
    let user = null;
    switch (this.params.userType) {
        case 't':
            user = yield proxy.Teacher.updateUserInfo(param);
            break;
        case 's':
            user = yield proxy.Student.updateUserInfo(param);
            break;
        case 'p':
            user = yield proxy.Parent.updateUserInfo(param);
            break;
        default:
            return result(this, {code: 911, msg: '不存在的客户端类型！'}, 404);
            break;
    }
    return result(this, {code: 900, userID: user.userID});
};

//获取用户收件箱信息
exports.getMsgBox = function *(next) {
    let body = this.request.query;
    let param = {
        userID: this.state.userID,
        start: body.start,
        limit: body.limit,
        read: body.read,
        userType: this.params.userType,
        type: body.type
    };
    // let list = [];
    // switch (this.params.userType) {
    //     case 't':
    //         list = yield proxy.Teacher.getMsg(param);
    //         break;
    //     case 's':
    //         list = yield proxy.Student.getMsg(param);
    //         break;
    //     case 'p':
    //         list = yield proxy.Parent.getMsg(param);
    //         break;
    //     default:
    //         return result(this, {code: 911, msg: '不存在的客户端类型！'}, 404);
    //         break;
    // }
    let list = yield proxy.Msg.getMsg(param);
    return result(this, {code: 900, list})
};

exports.getMsgDetail = function *(next) {
    let param = {
        userID: this.state.userID,
        userType: this.params.userType,
        msg_id: this.params.msg_id
    };
    // let msg = '';
    // switch (this.params.userType) {
    //     case 't':
    //         msg = yield proxy.Teacher.msgDetail(this.params.msg_id);
    //         break;
    //     case 's':
    //         msg = yield proxy.Student.msgDetail(this.params.msg_id);
    //         break;
    //     case 'p':
    //         msg = yield proxy.Parent.msgDetail(this.params.msg_id);
    //         break;
    //     default:
    //         return result(this, {code: 911, msg: '不存在的客户端类型！'}, 404);
    //         break;
    // }
    // let info = yield msg.toInfo();
    let info = yield proxy.Msg.msgDetail(param);
    return result(this, {code: 900, info});
};

//获取教师信息
exports.teacherInfo = function *(next) {
    let user = yield proxy.Teacher.getUserById(this.params.userID);
    if (!user) {
        return result(this, {code: 911, msg: '教师不存在！'}, 404);
    }
    return result(this, {code: 900, info: user.toInfo()});
};
//获取学生信息
exports.studentInfo = function *(next) {
    let user = yield proxy.Student.getUserById(this.params.userID);
    if (!user) {
        return result(this, {code: 911, msg: '学生不存在！'}, 404);
    }
    return result(this, {code: 900, info: user.toInfo()});
};
//获取家长信息
exports.parentInfo = function *(next) {
    let user = yield proxy.Parent.getUserById(this.params.userID);
    if (!user) {
        return result(this, {code: 911, msg: '家长不存在！'}, 404);
    }
    return result(this, {code: 900, info: user.toInfo()});
};

