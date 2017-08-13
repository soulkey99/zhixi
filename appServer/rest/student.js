/**
 * Created by MengLei on 2016-09-18.
 */
"use strict";
const wxMsg = require('./../utils/wxMsg');

//获取学生首页最近列表
exports.getRecentList = function *(next) {
    let body = this.request.query;
    let param = {
        userID: this.state.userID,
        start: body.start,
        limit: body.limit,
        type: body.type
    };
    let list = yield proxy.Student.recentList(param);
    return result(this, {code: 900, list});
};

//获取学生名下班级列表
exports.getMyClass = function *(next) {
    let body = this.request.query;
    let param = {
        userID: this.state.userID,
        start: body.start,
        limit: body.limit,
        status: body.status
    };
    let list = yield proxy.Student.getMyClass(param);
    return result(this, {code: 900, list});
};


//查找班级
exports.searchClass = function *(next) {
    let body = this.request.query;
    let list = [];
    let param = {};
    if (body.class_num) {
        if (!validator.isNumeric(body.class_num)) {
            return result(this, list);
        }
        param = {
            userID: this.state.userID,
            class_num: body.class_num
        }
    } else {
        return result(this, {code: 900, list});
    }
    list = yield proxy.Student.searchClass(param);
    return result(this, {code: 900, list});
};

//获取班级详情
exports.classDetail = function *(next) {
    let c = yield proxy.School.getClassByID(this.params.class_id);
    if (!c) {
        return result(this, {code: 911, msg: '班级不存在！'});
    }
    let info = yield c.toStudentInfo(this.state.userID);
    return result(this, {code: 900, info});
};

//加班级的历史
exports.getJoinClassHistory = function *(next) {
    let body = this.request.query;
    let param = {
        userID: this.state.userID,
        start: body.start,
        limit: body.limit,
        status: body.status
    };
    let list = yield proxy.Student.joinClassHistory(param);
    return result(this, {code: 900, list});
};

//学生申请加入班级
exports.joinClass = function *(next) {
    let param = {
        userID: this.state.userID,
        class_id: this.params.class_id,
        msg: this.request.body.msg
    };
    let sc = yield proxy.Student.joinClass(param);
    if (!sc) {
        return result(this, {code: 911, msg: '要申请加入的班级不存在！'}, 404);
    }
    return result(this, {code: 900, status: sc.status});
};

//学生获取作业列表
exports.getHomework = function *(next) {
    let body = this.request.query;
    let param = {
        userID: this.state.userID,
        start: body.start,
        limit: body.limit,
        sort: body.sort,
        status: body.status,
        getType: body.getType
    };
    if (this.params.class_id) {
        param['class_id'] = this.params.class_id;
    }
    let list = yield proxy.Student.homeworkList(param);
    return result(this, {code: 900, list});
};

//学生获取指定作业的全部题目列表
exports.getHomeworkDetailList = function *(next) {
    let param = {
        userID: this.state.userID,
        swork_id: this.params.swork_id
    };
    let list = yield proxy.Student.homeworkDetailList(param);
    if (!list) {
        return result(this, {code: 911, msg: '请求的资源不存在！'}, 404);
    }
    return result(this, {code: 900, list});
};

//学生获取指定作业的指定题目的详情
exports.getHomeworkQuestion = function *(next) {
    let param = {
        userID: this.state.userID,
        swork_id: this.params.swork_id,
        q_id: this.params.q_id
    };
    let info = yield proxy.Student.homeworkQuestion(param);
    if (!info) {
        return result(this, {code: 911, msg: '请求的资源不存在！'});
    }
    return result(this, {code: 900, info});
};

//学生获取指定作业的下一道未答题目
exports.getSworkNext = function *(next) {
    let param = {
        swork_id: this.params.swork_id,
        userID: this.state.userID
    };
    let info = yield proxy.Student.nextHomeworkQuestion(param);
    return result(this, {code: 900, info});
};

//学生作业答题
exports.checkHomeworkQuestion = function *(next) {
    let body = this.request.body;
    let param = {
        q_id: this.params.q_id,
        swork_id: this.params.swork_id,
        choice_id: body.choice_id,
        userID: this.state.userID
    };
    let info = yield proxy.Student.sworkCheck(param);
    return result(this, {code: 900});
};

//学生获取指定作业指定题目的回顾
exports.getHomeworkReview = function *(next) {
    let param = {
        swork_id: this.params.swork_id,
        q_id: this.params.q_id
    };
    let info = yield proxy.Student.sworkReview(param);
    return result(this, {code: 900, info});
};

//学生获取指定作业指定题目的结果
exports.getHomeworkResult = function*(next) {
    let param = {
        swork_id: this.params.swork_id,
        q_id: this.params.q_id
    };
    let info = yield proxy.Student.sworkResult(param);
    return result(this, {code: 900, info});
};

//学生获取指定作业详情
exports.getSworkDetail = function *(next) {
    let param = {
        swork_id: this.params.swork_id
    };
    let info = yield proxy.Student.sworkDetail(param);
    return result(this, {code: 900, info});
};

//学生获取指定作业答题步骤详情
exports.getHomeworkQuestionStep = function *(next) {
    let param = {
        userID: this.state.userID,
        swork_id: this.params.swork_id,
        q_id: this.params.q_id
    };
    let info = yield proxy.Student.homeworkStep(param);
    return result(this, {code: 900, info});
};

//学生获取错题本列表
exports.getWrongList = function *(next) {
    let body = this.request.query;
    let param = {
        userID: this.state.userID,
        type: body.type,
        subject: body.subject,
        grade: body.grade,
        version: body.version,
        start: body.start,
        limit: body.limit
    };
    let list = yield proxy.Student.wrongList(param);
    return result(this, {code: 900, list});
};

//学生获取已绑定的家长列表
exports.getParentList = function *(next) {
    let body = this.request.query;
    let param = {
        userID: this.state.userID,
        start: body.start,
        limit: body.limit
    };
    let list = yield proxy.Student.getParents(param);
    return result(this, {code: 900, list});
};

//学生解绑家长
exports.removeParent = function *(next) {
    let param = {
        userID: this.state.userID,
        p_id: this.params.p_id
    };
    yield proxy.Student.unbindParent(param);
    wxMsg.sendUnbindMsg({p_id: param.p_id, s_id: param.userID});
    return result(this, {code: 900});
};

//学生获取自己的统计信息
exports.getStat = function *(next) {
    let param = {
        userID: this.state.userID
    };
    let info = yield proxy.Student.stat(param);
    return result(this, {code: 900, info});
};

