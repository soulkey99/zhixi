/**
 * Created by MengLei on 2016-09-07.
 */
"use strict";

//获取教材版本与年级对应列表
exports.getVersionGrade = function *(next) {
    return result(this, {
        code: 900,
        list: [{"name": "北师大版", "grades": ["七年级上"]}]
        // list: [{"name": "人教版", "grades": ["七年级上", "七年级下", "八年级上", "八年级下", "九年级上", "九年级下"]}, {
        //     "name": "北师大版",
        //     "grades": ["七年级上", "七年级下", "八年级上", "八年级下", "九年级上", "九年级下"]
        // }, {"name": "华师大版", "grades": ["七年级上", "七年级下", "八年级上", "八年级下", "九年级上", "九年级下"]}, {
        //     "name": "冀教版",
        //     "grades": ["七年级上", "七年级下", "八年级上", "八年级下", "九年级上", "九年级下"]
        // }, {"name": "苏科版", "grades": ["七年级上", "七年级下", "八年级上", "八年级下", "九年级上", "九年级下"]}, {
        //     "name": "鲁教版",
        //     "grades": ["六年级上", "六年级下", "七年级上", "七年级下", "八年级上", "八年级下", "九年级上", "九年级下"]
        // }, {"name": "沪科版", "grades": ["七年级上", "七年级下", "八年级上", "八年级下", "九年级上", "九年级下"]}, {
        //     "name": "沪教版",
        //     "grades": ["六年级下", "七年级上", "七年级下", "八年级上", "八年级下", "九年级上", "九年级下"]
        // }, {"name": "青岛版", "grades": ["七年级上", "七年级下", "八年级上", "八年级下", "九年级上", "九年级下"]}, {
        //     "name": "浙教版",
        //     "grades": ["七年级上", "七年级下", "八年级上", "八年级下", "九年级上", "九年级下"]
        // }, {"name": "湘教版", "grades": ["七年级上", "七年级下", "八年级上", "八年级下", "九年级上", "九年级下"]}, {
        //     "name": "北京课改版",
        //     "grades": ["七年级上", "七年级下", "八年级上", "八年级下", "九年级上", "九年级下"]
        // }, {"name": "通用版", "grades": ["七年级上", "七年级下", "八年级上", "八年级下", "九年级上", "九年级下"]}]
    });
};

//获取教材目录信息
exports.getCatalog = function *(next) {
    let body = this.request.query;
    let param = {
        grade: body.grade,
        version: body.version,
        subject: body.subject
    };
    let list = yield proxy.Study.getCatalog(param);
    return result(this, {code: 900, list});
};

//获取教材详细信息
exports.getMaterialDetail = function *(next) {
    let body = this.request.query;
    let param = {
        grade: body.grade,
        version: body.version,
        subject: body.subject
    };
    let info = yield proxy.Study.getOneVersion(param);
    if (!info) {
        return result(this, {code: 911, msg: '对应教材不存在！'});
    }
    return result(this, {code: 900, info: info.toDetail()});
};

//获取节下的问题列表
exports.getSectionQuestion = function *(next) {
    let body = this.request.query;
    let param = {
        userID: this.state.userID,
        sec_id: this.params.sec_id,
        start: body.start,
        limit: body.limit
    };
    let list = yield proxy.Study.sectionQuestion(param);
    return result(this, {code: 900, list});
};

//获取学习题目
exports.getStudyQuestion = function *(next) {
    if (!this.params.q_id) {
        return result(this, {code: 904, msg: '缺少q_id参数！'}, 400);
    }
    let q = yield proxy.Study.getQuestionByID(this.params.q_id);
    return result(this, {code: 900, info: q.toObject({getters: true})});
};

//根据一串q_id获取问题列表
exports.getQuestionsByID = function *(next) {
    let body = this.request.query;
    if (!body.q_id) {
        return result(this, {code: 900, list: []});
    }
    let list = yield proxy.Study.getQuestionsByIDs(body.q_id.split(','));
    return result(this, {code: 900, list});
};

//根据条件获取教材、练习册列表（学段、年级、学科、版本、类型，支持分页）
exports.getExerciseBooks = function *(next) {
    let body = this.request.query;
    let param = {
        stage: body.stage,
        grade: body.grade,
        version: body.version,
        subject: body.subject,
        start: body.start,
        limit: body.limit,
        type: body.type
    };
    let list = yield proxy.Study.exerciseVersionList(param);
    return result(this, {code: 900, list});
};

//获取教材目录信息
exports.getVersionCatalog = function *(next) {
    let list = yield proxy.Study.getCatalog({ver_id: this.params.ver_id});
    return result(this, {code: 900, list});
};

//获取教材详情
exports.getVersionDetail = function *(next) {
    let ver = yield proxy.Study.getVersionByID(this.params.ver_id);
    return result(this, {code: 900, info: ver.toDetail()});
};

//获取教材、练习册的做题进度
exports.getVersionProcess = function *(next) {
    let param = {};
    if (this.params.ver_id) {
        param['userID'] = this.state.userID;
        param['ver_id'] = this.params.ver_id;
    } else {
        let body = this.request.query;
        param = {
            userID: this.state.userID,
            stage: body.stage,
            grade: body.grade,
            subject: body.subject,
            version: body.version
        }
    }
    let info = yield proxy.Study.versionProcess(param);
    return result(this, {code: 900, info});
};

//获取指定问题做过的练习列表
exports.getQuestionExercise = function *(next) {
    let body = this.request.query;
    let param = {
        userID: this.state.userID,
        q_id: this.params.q_id,
        start: body.start,
        limit: body.limit
    };
    let list = yield proxy.Study.questionExercise(param);
    return result(this, {code: 900, list});
};

//开始一个新的练习
exports.newExercise = function *(next) {
    let body = this.request.body;
    let param = {
        userID: this.state.userID,
        type: body.type || 'exercise',
        sec_id: body.sec_id,
        q_id: body.q_id
    };
    let e = yield proxy.Study.genExercise(param);
    return result(this, {code: 900, e_id: e.e_id});
};

//指定章节取一道没答过的题目
exports.getSectionNext = function *(next) {
    let body = this.request.query;
    let param = {
        sec_id: this.params.sec_id,
        userID: this.state.userID,
        q_id: body.q_id
    };
    let info = yield proxy.Study.sectionNext(param);
    return result(this, {code: 900, info});
};

//练习答题
exports.checkExercise = function *(next) {
    let body = this.request.body;
    if (!body.q_id) {
        return result(this, {code: 904, msg: '缺少q_id参数！'}, 400);
    }
    if (!body.choice_id) {
        return result(this, {code: 904, msg: '缺少choice_id参数！'}, 400);
    }
    yield proxy.Study.checkQuestion({
        userID: this.state.userID,
        e_id: this.params.e_id,
        q_id: body.q_id,
        choice_id: body.choice_id
    });
    return result(this, {code: 900});
};

//获取练习得分
exports.exercisePoint = function *(next) {
    let e = yield proxy.StudyExercise.getExerciseByID(this.params.e_id);
    if (!e) {
        return result(this, {code: 911, msg: '要获取的练习不存在！'});
    }
    let info = {point: e.point};
    let seed = info.point == undefined ? 80 : info.point;
    let percent = Number.parseInt(Math.floor(seed / 10).toFixed(0)) * 10;
    if (percent == 100) {
        percent = 99;
    } else if (percent == 0) {
        percent = 1;
    }
    info.percent = percent;
    return result(this, {code: 900, info});
};

//获取练习回顾
exports.getExerciseReview = function *(next) {
    let info = yield proxy.Study.getReview(this.params.e_id);
    return result(this, {code: 900, info});
};

//获取下一小节
exports.getNextSection = function *(next) {
    let param = {
        userID: this.state.userID,
        sec_id: this.params.sec_id
    };
    let info = yield proxy.Study.nextSectionQuestion(param);
    return result(this, {code: 900, info});
};

//获取指定练习的答题步骤
exports.getExerciseSteps = function *(next) {
    let param = {
        userID: this.state.userID,
        e_id: this.params.e_id
    };
    let info = yield proxy.Study.exerciseSteps(param);
    return result(this, {code: 900, info});
};

//获取指定题目的最短路径
exports.getShortestPath = function *(next) {
    let list = yield proxy.Study.shortestPath(this.params.q_id);
    return result(this, {code: 900, list});
};


//--------之前迁移过来的接口-------------------------------------------------

//获取练习列表
exports.getExerciseList = function *(next) {
    let body = this.request.query;
    let param = {
        userID: this.state.userID,
        type: 'student',
        start: body.start,
        limit: body.limit
    };
    if (body.stage) {
        param['stage'] = body.stage;
    }
    if (body.grade) {
        param['grade'] = body.grade;
    }
    if (body.subject) {
        param['subject'] = body.subject;
    }
    let list = yield proxy.StudyExercise.getList(param);
    return result(this, {code: 900, list});
};

//开始一个新的练习
exports.genExercise = function *(next) {
    let body = this.request.body;
    let e = proxy.StudyExercise.genExercise({
        userID: this.state.userID,
        type: body.type,
        sec_id: body.sec_id,
        q_id: body.q_id
    });
    return result(this, {code: 900, info: e.toObject({getters: true})});
};


//获取练习结果
exports.getExerciseResult = function *(next) {
    if (!this.params.e_id) {
        return result(this, {code: 904, msg: '缺少e_id参数！'}, 400);
    }
    let info = yield proxy.StudyExercise.getResult(this.params.e_id);
    return result(this, {code: 900, info});
};

//获取练习记录详情
exports.getExerciseDetail = function *(next) {
    let info = yield proxy.StudyExercise.getDetail(this.params.e_id);
    return result(this, {code: 900, info});
};

//获取问题附加信息列表
exports.getStudyQuestionExtra = function *(next) {
    let body = this.request.body;
    let param = {
        q_id: this.params.q_id,
        type: body.type
    };
    if (body.limit) {
        param['limit'] = body.limit;
    }
    let list = yield proxy.StudyQuestion.getExtra(param);
    return result(this, {code: 900, list});
};

//获取学段年级科目列表
exports.getGradeSubject = function *(next) {
    let conf = yield proxy.SysConfig.getConfigByType('stageSubjectGrade');
    return result(this, {code: 900, list: conf.param});
};

//获取教材版本列表
exports.getVersionList = function *(next) {
    let body = this.request.query;
    let param = {
        stage: body.stage,
        grade: body.grade,
        subject: body.subject,
        userType: 'student',
        city: body.city,
        start: body.start,
        limit: body.limit
    };
    if (body.action) {
        param['action'] = body.action;
    }
    let list = yield proxy.StudyVersion.getList(param);
    return result(this, {code: 900, list});
};


//检查某道题是否有未完成的练习
exports.getPending = function *(next) {
    let body = this.request.query;
    let param = {
        userID: this.state.userID,
        q_id: body.q_id,
        sec_id: body.sec_id
    };
    let info = yield proxy.StudyExercise.checkPending(param);
    return result(this, {code: 900, info});
};


//关闭一个练习
exports.cancelExercise = function *(next) {
    yield proxy.StudyExercise.cancel({userID: this.state.userID, e_id: this.params.e_id});
    return result(this, {code: 900});
};

