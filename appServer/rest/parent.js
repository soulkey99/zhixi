/**
 * Created by MengLei on 2016-11-07.
 */
"use strict";
const wxMsg = require('./../utils/wxMsg');

//获取学生信息
exports.getStuInfo = function *(next) {
    let stu = yield proxy.Student.getUserById(this.params.s_id);
    let check = yield proxy.Parent.checkBind({userID: this.state.userID, s_id: this.params.s_id});
    let info = stu.toInfo();
    info.bind = check;
    return result(this, {code: 900, info});
};

//绑定学生
exports.bindStudent = function *(next) {
    let param = {userID: this.state.userID, s_id: this.params.s_id};
    let ps = yield proxy.Parent.addStudent(param);
    wxMsg.bindMsg({p_id: param.userID, s_id: param.s_id});
    return result(this, {code: 900, ps_id: ps.ps_id});
};

//获取绑定列表
exports.getBindedStudent = function *(next) {
    let body = this.request.query;
    let param = {
        userID: this.state.userID,
        start: body.start,
        limit: body.limit
    };
    let list = yield proxy.Parent.getStudent(param);
    return result(this, {code: 900, list});
};

//家长查看学生作业
exports.getStudentHomework = function *(next) {
    let param = {
        swork_id: this.params.swork_id
    };
    let info = yield proxy.Teacher.homeworkStatStudentDetail(param);
    return result(this, {code: 900, info});
};


