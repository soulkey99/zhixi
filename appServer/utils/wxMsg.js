/**
 * Created by MengLei on 2016-11-09.
 */
"use strict";
const wxUtil = require('./weixin');
const co = require('co');

/**
 * 给家长发送解除绑定的消息
 * @param param = {p_id: '', s_id: ''}
 */
exports.sendUnbindMsg = function *(param) {
    exec(function *() {
        let stu = yield proxy.Student.getUserById(param.s_id);
        let content = stu.nick + '解除了您的绑定！';
        yield wxUtil.sendMsg({userType: 'p', userID: param.p_id, msg: content});
    });
};

/**
 * 给家长发送绑定学生成功的消息
 * @param param = {p_id: '', s_id: ''}
 */
exports.bindMsg = function (param) {
    exec(function *() {
        let stu = yield proxy.Student.getUserById(param.s_id);
        let content = `绑定${stu.nick}成功！`;
        yield wxUtil.sendMsg({userType: 'p', userID: param.p_id, msg: content});
    });
};

/**
 * 给家长发送作业评价
 * @param param = {s_id: '', content: '', p_id: ''}
 */
exports.sendFeedbackMsg = function (param) {
    exec(function *() {
        let stu = yield proxy.Student.getUserById(param.s_id);
        let p_ids = [param.p_id];  //如果传了p_id，那么就只发送给这个家长，否则，消息发送给所有家长
        if (!param.p_id) {
            p_ids = yield proxy.Student.getParentIDs(param.s_id);
        }
        let content = stu.nick + '收到了一份作业评价：' + param.content;
        for (let i = 0; i < p_ids.length; i++) {
            yield wxUtil.sendMsg({userType: 'p', userID: p_ids[i], msg: content});
        }
    });
};

/**
 * execute generator functions
 * @param {*} func
 */
function exec(func) {
    co(func).then(function (resp) {
        // console.log(JSON.stringify(resp));
    }, function (err) {
        logger.error('wxMsg error: ' + err.message);
    });
}