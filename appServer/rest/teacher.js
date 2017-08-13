/**
 * Created by MengLei on 2016-09-13.
 */
"use strict";
const wxMsg = require('../utils/wxMsg');

//教师首页待办事项
exports.getTodoList = function *(next) {
    let body = this.request.query;
    let param = {
        userID: this.state.userID,
        limit: body.limit
    };
    let list = yield proxy.Teacher.todoList(param);
    return result(this, {code: 900, list});
};

//获取教师名下的所有班级列表
exports.getMyClass = function *(next) {
    let body = this.request.query;
    let param = {
        userID: this.state.userID,
        start: body.start,
        limit: body.limit
    };
    let list = yield proxy.Teacher.getMyClass(param);
    return result(this, {code: 900, list});
};

//创建学校
exports.createSchool = function *(next) {
    let school = yield proxy.School.getTeacherSchool(this.state.userID);
    if (school && school.type != 'default') {
        return result(this, {code: 910, msg: '创建失败，当前用户已经创建过机构！'}, 400);
    }
    let body = this.request.body;
    let param = {
        master_id: this.state.userID,
        name: body.name,
        province: body.province,
        city: body.city,
        type: body.type,
        master_name: body.master_name,
        master_passwd: body.master_passwd,
        master_id_num: body.master_id_num,
        master_email: body.master_email,
        master_qq: body.master_qq,
        master_weixin: body.master_weixin
    };
    if (!school) {
        school = yield proxy.School.createSchool(param);
    } else {
        param.school_id = school.school_id;
        school = yield proxy.School.editSchool(param);
    }
    return result(this, {code: 900, school_id: school.school_id});
};

//编辑学校信息
exports.editSchool = function *(next) {
    let body = this.request.body;
    let param = {
        school_id: this.params.school_id,
        name: body.name,
        city: body.city,
        province: body.province,
        type: body.type,
        master_passwd: body.master_passwd,
        master_name: body.master_name,
        master_id_num: body.master_id_num,
        master_email: body.master_email,
        master_qq: body.master_qq,
        master_weixin: body.master_weixin,
        remark: body.remark,
        id_front: body.id_front,
        id_back: body.id_back,
        id_num: body.id_num,
        org_name: body.org_name,
        org_license: body.org_license,
        admin_proof: body.admin_proof,
        org_num: body.org_num,
        org_capital: body.org_capital,
        org_people_num: body.org_people_num
    };
    let school = yield proxy.School.editSchool(param);
    return result(this, {code: 900, school_id: school.school_id});
};

//创建班级
exports.createClass = function *(next) {
    let body = this.request.body;
    let param = {
        t_id: this.state.userID,
        school_id: this.params.school_id,
        name: body.name,
        grade: body.grade,
        subject: body.subject,
        version: body.version,
        duration: body.duration,
        startAt: body.startAt,
        endAt: body.endAt,
        week: body.week,
        week_num: body.week_num,
        noon: body.noon,
        hour: body.hour,
        minute: body.minute
    };
    if (param.school_id == 'my') {
        let school = yield proxy.School.getMySchool(this.state.userID);
        param.school_id = school.school_id;
    }
    let c = yield proxy.School.createClass(param);
    return result(this, {code: 900, class_id: c.class_id});
};

//编辑班级信息
exports.editClass = function *(next) {
    let body = this.request.body;
    let param = {
        class_id: this.params.class_id,
        name: body.name,
        duration: body.duration
    };
    let c = yield proxy.School.editClass(param);
    return result(this, {code: 900, class_id: c.class_id});
};

//教师向班级添加学生
exports.classAddStudent = function *(next) {
    let body = this.request.body;
    let param = {
        class_id: this.params.class_id,
        s_id: body.s_id
    };
    let c = yield proxy.School.getClassByID(param.class_id);
    if (!c) {
        return result(this, {code: 911, msg: '班级不存在！'}, 404);
    }
    if (c.t_id.toString() != this.state.userID) {
        return result(this, {code: 910, msg: '不是自己的班级，无法添加学生！'}, 401);
    }
    param['school_id'] = c.school_id;
    yield proxy.Teacher.addStudent(param);
    return result(this, {code: 900});
};

//教师删除班级学生
exports.classRemoveStudent = function *(next) {
    let body = this.request.body;
    let param = {
        class_id: this.params.class_id,
        s_id: body.s_id
    };
    yield proxy.Teacher.removeStudent(param);
    return result(this, {code: 900});
};

//教师获取班级学生列表
exports.getClassStudent = function *(next) {
    let body = this.request.query;
    let param = {
        class_id: this.params.class_id,
        start: body.start,
        limit: body.limit
    };
    let list = yield proxy.School.classStudent(param);
    return result(this, {code: 900, list});
};

exports.getClassDetail = function *(next) {
    let c = yield proxy.School.getClassByID(this.params.class_id);
    let info = yield c.toTeacherDetail();
    return result(this, {code: 900, info});
};

//获取指定班级的课时计划
exports.getSchedule = function *(next) {
    let body = this.request.query;
    let param = {
        class_id: this.params.class_id,
        start: body.start,
        page: body.page,
        limit: body.limit
    };
    let list = yield proxy.School.getClassSchedule(param);
    return result(this, {code: 900, list});
};

//获取课时详情
exports.getScheduleDetail = function *(next) {
    let schedule = yield proxy.School.getScheduleByID(this.params.schedule_id);
    let info = yield schedule.toClassDetail();
    return result(this, {code: 900, info});
};

//编辑课时计划
exports.editSchedule = function *(next) {
    let body = this.request.body;
    let param = {
        schedule_id: this.params.schedule_id,
        plan: body.plan
    };
    let schedule = yield proxy.School.editClassSchedule(param);
    return result(this, {code: 900, schedule_id: schedule.schedule_id});
};

//教师搜索学生列表
exports.searchStudent = function *(next) {
    let body = this.request.query;
    let param = {
        phone: body.phone,
        nick: body.nick,
        name: body.name,
        start: body.start,
        limit: body.limit
    };
    let list = yield proxy.Student.search(param);
    return result(this, {code: 900, list});
};

//教师获取加班级申请列表
exports.getClassJoinList = function *(next) {
    let body = this.request.query;
    let param = {
        userID: this.state.userID,
        start: body.start,
        limit: body.limit,
        status: body.status
    };
    if (this.params.class_id) {
        param['class_id'] = this.params.class_id;
    }
    let list = yield proxy.Teacher.classJoinList(param);
    return result(this, {code: 900, list});
};

//教师审核申请记录
exports.checkJoin = function *(next) {
    let body = this.request.body;
    let param = {
        cs_id: this.params.cs_id,
        status: body.status,
        reason: body.reason
    };
    let cs = yield proxy.Teacher.checkClassJoin(param);
    if (!cs) {
        return result(this, {code: 911, msg: '申请记录不存在！'}, 404);
    }
    return result(this, {code: 900, status: cs.status});
};

//教师留作业
exports.createHomework = function *(next) {
    let body = this.request.body;
    let param = {
        schedule_id: this.params.schedule_id,
        userID: this.state.userID,
        q_id: body.q_id,
        qlist: body.qlist,
        endAt: body.endAt,
        status: body.status,
        auto: body.auto
    };
    if (body.status == 'abandoned') {
        yield proxy.Teacher.abandonHomework(param);
        return result(this, {code: 900, schedule_id: param.schedule_id});
    } else if (body.status == 'waiting') {
        yield proxy.Teacher.abandonHomework(param);
        return result(this, {code: 900, schedule_id: param.schedule_id});
    }
    let schedule = yield proxy.Teacher.assignHomework(param);
    return result(this, {code: 900, schedule_id: schedule.schedule_id})
};

//指定学生单独留补充作业
exports.assignAdditionHomework = function *(next) {
    let body = this.request.body;
    let param = {
        s_id: this.params.s_id,
        schedule_id: this.params.schedule_id,
        endAt: body.endAt,
        q_id: body.q_id,
        qlist: body.qlist
    };
    let swork = yield proxy.Teacher.additionHomework(param);
    return result(this, {code: 900, swork_id: swork.swork_id});
};

//获取指定课时学生收到的作业列表
exports.getStudentHomeworkList = function *(next) {
    let body = this.request.query;
    let param = {
        schedule_id: this.params.schedule_id,
        start: body.start,
        page: body.page,
        limit: body.limit,
        type: body.type,
        status: body.status
    };
    let list = yield proxy.Teacher.studentHomeworkList(param);
    return result(this, {code: 900, list});
};

//教师获取指定学生作业的指定题目答题流程
exports.getSworkQuestionSteps = function *(next) {
    let param = {
        swork_id: this.params.swork_id,
        q_id: this.params.q_id
    };
    let info = yield proxy.Teacher.sworkQuestionSteps(param);
    return result(this, {code: 900, info});
};

//教师发布draft状态的作业
exports.publishHomework = function *(next) {
    let schedule = yield proxy.School.getScheduleByID(this.params.schedule_id);
    if (schedule.homework_status != 'draft') {
        return result(this, {code: 90})
    }
    yield proxy.Teacher.publishHomework(schedule.schedule_id);
    return result(this, {code: 900, schedule_id: schedule.schedule_id});
};

//更新指定课时的作业信息，截止时间、是否自动发布
exports.updateHomework = function *(next) {
    let body = this.request.body;
    let param = {
        schedule_id: this.params.schedule_id,
        homework_endAt: body.endAt,
        homework_auto: body.auto
    };
    let schedule = yield proxy.Teacher.updateSchedule(param);
    return result(this, {code: 900, schedule_id: schedule.schedule_id});
};

//留作业抽题
exports.getHomeworkQList = function *(next) {
    let body = this.request.query;
    let param = {
        version: body.version,
        grade: body.grade,
        getType: body.getType,
        start: body.start,
        limit: body.limit
    };
    let list = yield proxy.Teacher.homeworkQList(param);
    return result(this, {code: 900, list});
};

//指定课时已留作业题目列表
exports.getScheduleHomework = function *(next) {
    let param = {
        schedule_id: this.params.schedule_id,
        userID: this.state.userID
    };
    let schedule = yield proxy.School.getScheduleByID(param.schedule_id);
    let list = yield schedule.toQuestionList();
    return result(this, {code: 900, status: schedule.homework_status, list});
};

//曾经留过的作业列表
exports.getMyHomework = function *(next) {
    let body = this.request.query;
    let param = {
        userID: this.state.userID,
        start: body.start,
        limit: body.limit,
        status: body.status,
        sort: body.sort
    };
    if (this.params.class_id) {
        param['class_id'] = this.params.class_id;
    }
    let list = yield proxy.Teacher.myHomeworkList(param);
    return result(this, {code: 900, list});
};

//获取指定课时作业统计结果
exports.getHomeworkStat = function *(next) {
    let info = yield proxy.Teacher.scheduleHomeworkStat(this.params.schedule_id);
    return result(this, {code: 900, info});
};

//获取指定作业未完成学生统计列表
exports.getHomeworkStatUnfinished = function *(next) {
    let body = this.request.query;
    let param = {
        schedule_id: this.params.schedule_id,
        start: body.start,
        limit: body.limit
    };
    let list = yield proxy.Teacher.unfinishedHomeworkStudentList(param);
    return result(this, {code: 900, list});
};

//获取指定作业的题目统计列表（只返回错题）
exports.getHomeworkStatQuestions = function *(next) {
    let body = this.request.query;
    let param = {
        schedule_id: this.params.schedule_id,
        start: body.start,
        limit: body.limit
    };
    let list = yield proxy.Teacher.homeworkStatWrongQuestion(param);
    return result(this, {code: 900, list});
};

//获取指定作业的学生掌握情况列表
exports.getHomeworkStatStudentList = function *(next) {
    let list = yield proxy.Teacher.homeworkStatStudentList({schedule_id: this.params.schedule_id});
    return result(this, {code: 900, list});
};

//获取指定学生指定作业的题目统计详情
exports.getHomeworkStatStudentDetail = function *(next) {
    let body = this.request.query;
    let param = {
        userID: this.state.userID,
        schedule_id: this.params.schedule_id,
        s_id: this.params.s_id,
        type: body.type,
        start: body.start,
        limit: body.limit
    };
    let info = yield proxy.Teacher.homeworkStatStudentDetail(param);
    return result(this, {code: 900, info});
};

//获取指定学生作业的答题统计详情
exports.getSworkStatStudentDetail = function *(next) {
    let param = {
        userID: this.state.userID,
        swork_id: this.params.swork_id
    };
    let info = yield proxy.Teacher.homeworkStatStudentDetail(param);
    return result(this, {code: 900, info});
};

//获取指定课时作业指定题目答错的学生列表
exports.getHomeworkStatQuestionWrongStudent = function *(next) {
    let body = this.request.query;
    let param = {
        userID: this.state.userID,
        schedule_id: this.params.schedule_id,
        q_id: this.params.q_id,
        start: body.start,
        limit: body.limit
    };
    let info = yield proxy.Teacher.homeworkStatQuestionWrongStudent(param);
    return result(this, {code: 900, info});
};

//获取反馈模板列表
exports.getFeedbackTemplate = function *(next) {
    let body = this.request.query;
    let param = {
        userID: this.state.userID,
        start: body.start,
        limit: body.limit
    };
    let list = yield proxy.Teacher.feedbackTemplate(param);
    return result(this, {code: 900, list});
};

//获取指定课时给学生留的反馈
exports.getStudentHomeworkFeedback = function *(next) {
    let body = this.request.query;
    let param = {
        userID: this.state.userID,
        schedule_id: this.params.schedule_id,
        s_id: this.params.s_id,
        start: body.start,
        limit: body.limit
    };
    let list = yield proxy.Teacher.homeworkFeedback(param);
    return result(this, {code: 900, list});
};

//给指定学生指定课时添加反馈
exports.addStudentHomeworkFeedback = function *(next) {
    let body = this.request.body;
    let param = {
        userID: this.state.userID,
        schedule_id: this.params.schedule_id,
        s_id: this.params.s_id,
        content: body.content
    };
    let info = yield proxy.Teacher.addHomeworkFeedback(param);
    wxMsg.sendFeedbackMsg({s_id: param.s_id, content: param.content});   //发送微信消息
    yield proxy.Msg.createUserMsg({   //保存发给学生端的消息
        type: 'system',
        to: param.s_id,
        toType: 's',
        content: param.content,
        param: {
            type: 'homeworkFeedback',
            schedule_id: param.schedule_id,
            class_id: info.class_id,
            feedback_id: info.feedback_id
        }
    });
    return result(this, {code: 900, feedback_id: info.feedback_id});
};



