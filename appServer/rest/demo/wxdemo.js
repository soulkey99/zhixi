/**
 * Created by MengLei on 2016-12-06.
 */
"use strict";

//获取初中列表
exports.getJuniorSchoolList = function *(next) {
    let body = this.request.query;
    let param = {};
    if (body.key) {
        param['key'] = body.key;
    }
    let list = yield proxy.wxDemo1.juniorSchoolList(param);
    return result(this, {code: 900, list});
};

//获取高中列表
exports.getHighSchoolList = function *(next) {
    let body = this.request.query;
    let param = {};
    if (body.key) {
        param['key'] = body.key;
    }
    let list = yield proxy.wxDemo1.highSchoolList(param);
    return result(this, {code: 900, list});
};

//添加高中
exports.addHighSchoolItem = function *(next) {
    let body = this.request.body;
    let param = {
        name: body.name,
        point: body.point,
        code: body.code,
        main_subject_point: body.main_subject_point,
        math_point: body.math_point,
        language_point: body.language_point
    };
    let school = yield proxy.wxDemo1.addHighSchool(param);
    return result(this, {code: 900});
};

//添加初中
exports.addJuniorSchoolItem = function *(next) {
    let body = this.request.body;
    let param = {
        name: body.name
    };
    let school = yield proxy.wxDemo1.addJuniorSchool(param);
    return result(this, {code: 900, school_id: school.school_id});
};

//根据ID获取问题
exports.getQuestion = function *(next) {
    let q = yield proxy.wxDemo1.getQuestionByID(this.params.q_id);
    return result(this, {code: 900, info: q.toInfo()});
};

//学生填写
exports.userFillInfo = function *(next) {
    let body = this.request.body;
    let param = {
        userID: this.state.userID,
        school_id: body.school_id,
        school_name: body.school_name,
        math_point: body.math_point,
        rank: body.rank,
        target_id: body.target_id,
        target_name: body.target_name
    };
    let fill = yield proxy.wxDemo1.fillInfo(param);
    return result(this, {code: 900});
};

//获取报告
exports.getShortReport = function *(next) {
    let param = {
        userID: this.state.userID
    };
    let report = yield proxy.wxDemo1.shortReport(param);
    return result(this, {code: 900, info: report})
};

//新建一个练习
exports.genExercise = function *(next) {
    let param = {
        userID: this.state.userID
    };
    let e = yield proxy.wxDemo1.newExercise(param);
    return result(this, {code: 900, e_id: e.e_id, group: e.group});
};

//获取练习的下一道题
exports.getNextQuestion = function *(next) {
    let q_id = yield proxy.wxDemo1.nextEQuestion(this.params.e_id);
    return result(this, {code: 900, q_id});
};

//答题
exports.qCheck = function *(next) {
    let body = this.request.body;
    let param = {
        userID: this.state.userID,
        e_id: this.params.e_id,
        q_id: body.q_id,
        choice_id: body.choice_id
    };
    yield proxy.wxDemo1.check(param);
    return result(this, {code: 900});
};

//获取最后的报告
exports.getMyReport = function *(next) {
    let e = yield proxy.wxDemo1.getExerciseByID(this.params.e_id);
    if (e.status != 'finished') {
        return result(this, {code: 910, msg: '练习状态不对！'});
    }
    let info = yield proxy.wxDemo1.getReport(this.params.e_id);
    return result(this, {code: 900, info});
};



