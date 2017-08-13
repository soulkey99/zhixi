/**
 * Created by MengLei on 2016-08-26.
 */
"use strict";
/**
 * 根据ID获取用户记录
 * @param id
 * @returns {*}
 */
exports.getUserById = function *(id) {
    return yield model.UserP.findById(id);
};

/**
 * 修改用户信息
 * @param param = {nick: '', name: '', intro: '', avatar: '', school: '', version: '', grade: ''}
 * @returns {*}
 */
exports.updateUserInfo = function *(param) {
    let setObj = {};
    if (param.nick != undefined) {
        setObj['nick'] = param.nick;
    }
    if (param.name != undefined) {
        setObj['name'] = param.name;
    }
    if (param.intro != undefined) {
        setObj['intro'] = param.intro;
    }
    if (param.avatar != undefined) {
        setObj['avatar'] = param.avatar;
    }
    return yield model.UserP.findByIdAndUpdate(param.userID, {$set: setObj}, {new: true});
};

/**
 * 根据手机号获取用户记录
 * @param phone
 * @returns {*}
 */
exports.getUserByPhone = function *(phone) {
    return yield model.UserP.findOne({phone: phone, delete: false});
};

/**
 * 创建用户
 * @param param = {phone: '', nick: '', avatar: '', intro: '', }
 * @returns {*}
 */
exports.createUser = function *(param) {
    let user = new (model.UserP)();
    if (param.userID) {
        user._id = param.userID;
    }
    if (param.phone) {
        user.phone = param.phone;
    }
    if (param.passwd) {
        user.passwd = param.passwd;
    }
    if (param.nick) {
        user.nick = param.nick;
    }
    if (param.avatar) {
        user.avatar = param.avatar;
    }
    if (param.type) {
        user.type = param.type;
    }
    return yield user.save();
};

/**
 * 根据userID获取绑定的sso记录列表或者指定的某一条记录
 * @param param = {userID: '', type: ''}
 * @returns {*}
 */
exports.getUserSSO = function *(param) {
    let query = {userID: param.userID, valid: true};
    if (param.type) {
        query['type'] = param.type;
        return yield model.UserPSSO.findOne(query);
    } else {
        return yield model.UserPSSO.find(query);
    }
};

/**
 * 获取指定openid
 * @param param = {userID: '', type: ''}
 * @returns {*}
 */
exports.getOpenID = function *(param) {
    let query = {userID: param.userID, type: param.type, valid: true};
    let sso = yield model.UserPSSO.findOne(query).sort({createdAt: -1});
    if (sso) {
        return sso.openid;
    } else {
        return '';
    }
};

/**
 * 根据openid或者unionid获取sso记录信息
 * @param param = {openid: '', ssoType: '', unionid: ''}
 * @returns {*}
 */
exports.getSSOByOpenID = function *(param) {
    let query = {valid: true};
    if (param.unionid) {
        query['unionid'] = param.unionid;
        query['type'] = param.ssoType;
    } else {
        query['openid'] = param.openid;
        query['type'] = param.ssoType;
    }
    return yield model.UserPSSO.findOne(query);
};

/**
 * 创建一条sso记录
 * @param param = {userID: '', ssoType: '', openid: '', avatar: '', nick: '', access_token: '', expire: '', unionid: ''}
 * @returns {*}
 */
exports.createSSO = function *(param) {
    let sso = new (model.UserPSSO)();
    sso.userID = param.userID;
    sso.type = param.ssoType;
    sso.nick = param.nick || '';
    sso.avatar = param.avatar || '';
    sso.openid = param.openid;
    sso.unionid = param.unionid;
    sso.access_token = param.access_token;
    sso.refresh_token = param.refresh_token;
    sso.expire_at = new Date(Date.now() + 7200000);
    sso.refresh_at = new Date();
    return yield sso.save();
};

/**
 * 家长主动添加学生
 * @param param = {userID: '', s_id: ''}
 * @returns {*}
 */
exports.addStudent = function *(param) {
    let ps = yield model.ParentStudent.findOne({p_id: param.userID, s_id: param.s_id});
    if (ps) {
        ps = yield model.ParentStudent.findByIdAndUpdate(ps._id, {$set: {status: 'verified', valid: true}});
    } else {
        ps = new (model.ParentStudent)();
        ps.p_id = param.userID;
        ps.s_id = param.s_id;
        ps.status = 'verified';
        ps.valid = true;
        yield ps.save();
    }
    return ps;
};

/**
 * 家长检查学生是否已经绑定过
 * @param param = {userID: '', s_id: ''}
 * @returns {boolean}
 */
exports.checkBind = function *(param) {
    let ps = yield model.ParentStudent.findOne({p_id: param.userID, s_id: param.s_id, status: 'verified', valid: true});
    return !!ps;
};

/**
 * 获取家长已绑定的学生列表
 * @param param = {userID: '', start: '', limit: ''}
 * @returns {Array}
 */
exports.getStudent = function *(param) {
    let query = {
        p_id: param.userID,
        valid: true,
        status: 'verified'
    };
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let res = yield model.ParentStudent.find(query).sort({createdAt: -1}).skip(start).limit(count);
    let list = [];
    for (let i = 0; i < res.length; i++) {
        let item = yield res[i].toStudentInfo();
        list.push(item);
    }
    return list;
};

/**
 * 获取指定家长的名下学生的最新一条反馈
 * @param param = {userID: ''}
 * @returns {*}
 */
exports.lastFeedback = function *(param) {
    let stus = yield model.ParentStudent.find({p_id: param.userID, status: 'verified', valid: true});
    let s_ids = stus.map(i=>i.s_id);
    return yield model.HomeworkFeedback.findOne({s_id: {$in: s_ids}}).sort({createdAt: -1});
};

/**
 * 获取指定家长的名下学生的最新一条作业
 * @param param = {userID: ''}
 * @returns {*}
 */
exports.lastHomework = function *(param) {
    let stus = yield model.ParentStudent.find({p_id: param.userID, status: 'verified', valid: true});
    let s_ids = stus.map(i=>i.s_id);
    return yield model.StudentHomework.findOne({s_id: {$in: s_ids}}).sort({createdAt: -1});
};


