/**
 * Created by MengLei on 2016-09-20.
 */
"use strict";

/**
 * 创建一条系统广播消息
 * @param param = {to: 'teacher/student/parent/all', content: '', param: {}}
 * @returns {*}
 */
exports.createMsg = function *(param) {
    let msg = new (model.Msg)();
    msg.type = 'broadcast';
    msg.to = param.to;
    msg.content = param.content;
    msg.param = param.param;
    return yield msg.save();
};

/**
 * 创建一条给用户的系统消息
 * @param param = {type: 'system/personal', to: '', toType: 's/t/p', content: '', param: {}, from: '', fromType: ''}
 * @returns {*}
 */
exports.createUserMsg = function *(param) {
    let MsgModel = param.toType == 's' ? model.MsgS : param.toType == 't' ? model.MsgT : model.MsgP;
    let msg = new MsgModel();
    msg.type = param.type;
    msg.to = param.to;
    msg.content = param.content;
    if (param.param) {
        msg.param = param.param;
    }
    if (param.from) {
        msg.from = param.from;
        msg.fromType = param.fromType;
    }
    return yield msg.save();
};

/**
 * 获取收件箱消息列表
 * @param param = {userID: '', userType: '', read: '', type: '', start: '', limit: ''}
 * @returns {Array}
 */
exports.getMsg = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let MsgModel = param.userType == 's' ? model.MsgS : param.userType == 't' ? model.MsgT : model.MsgP;
    if (start == 0) {//每次获取收件箱并且分页为第一页的情况下，先检查是否有最新的广播消息需要添加给该用户
        let npmsg = yield MsgModel.findOne({to: param.userID, type: 'broadcast'}).sort({createdAt: -1}); //第一条广播消息的时间
        let inArray = ['all'];
        if (param.userType == 's') {
            inArray.push('student');
        } else if (param.userType == 't') {
            inArray.push('teacher');
        } else {
            inArray.push('parent');
        }
        let query = {to: {$in: inArray}};
        if (npmsg) {
            query['createdAt'] = {$gt: npmsg.createdAt};
        }
        let pmsg = yield model.Msg.find(query);
        for (let i = 0; i < pmsg.length; i++) {
            let nmsg = new MsgModel();
            // nmsg._id = pmsg[i]._id;
            nmsg.type = 'broadcast';
            nmsg.to = param.userID;
            nmsg.content = pmsg[i].content;
            nmsg.param = pmsg[i].param;
            nmsg.createdAt = pmsg[i].createdAt;
            nmsg.updateAt = pmsg[i].updatedAt;
            yield nmsg.save();
        }
    }
    let query = {to: param.userID};
    if (param.read != undefined) {
        query['read'] = param.read == 'true';
    }
    if (param.type) {
        query['type'] = param.type;
    }
    let res = yield MsgModel.find(query).sort({createdAt: -1}).skip(start).limit(count);
    let list = [];
    for (let i = 0; i < res.length; i++) {
        list.push(yield res[i].toItem());
    }
    return list;
};

/**
 * 根据msgid获取msg的详情，同时将该消息设置为已读
 * @param param = {userType: '', msg_id: '', userID: ''}
 * @returns {*}
 */
exports.msgDetail = function *(param) {
    let MsgModel = param.userType == 's' ? model.MsgS : param.userType == 't' ? model.MsgT : model.MsgP;
    let msg = yield MsgModel.findByIdAndUpdate(param.msg_id, {$set: {read: true, readAt: new Date()}}, {new: true});
    return yield msg.toItem();
};

/**
 * 将指定msg_id标记为已读
 * @param param = {userType: '', msg_id: '逗号分隔'}
 * @returns {boolean}
 */
exports.markRead = function *(param) {
    let MsgModel = param.userType == 's' ? model.MsgS : param.userType == 't' ? model.MsgT : model.MsgP;
    let ids = param.msg_id.split(',');
    yield MsgModel.update({_id: {$in: ids}}, {$set: {read: true, readAt: new Date()}}, {new: true});
    return true;
};


