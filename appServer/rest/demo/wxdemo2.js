/**
 * Created by MengLei on 2016-12-20.
 */
"use strict";

//根据ID获取问题(OK)
exports.getQuestion = function *(next) {
    let q = yield proxy.wxDemo2.getQuestionByID(this.params.q_id);
    return result(this, {code: 900, info: q.toInfo()});
};

//学生填写个人信息(OK)
exports.userFillInfo = function *(next) {
    let body = this.request.body;
    let param = {
        userID: this.state.userID,
        school_id: body.school_id,
        school_name: body.school_name,
        math_point: body.math_point,
        main_point: body.main_point,
        rank: body.rank,
        target_id: body.target_id,
        target_name: body.target_name
    };
    let fill = yield proxy.wxDemo2.fillInfo(param);
    return result(this, {code: 900});
};

//获取小报告(OK)
exports.getShortReport = function *(next) {
    let param = {
        userID: this.state.userID
    };
    let report = yield proxy.wxDemo2.shortReport(param);
    return result(this, {code: 900, info: report})
};

//新建一个练习(OK)
exports.genExercise = function *(next) {
    let param = {
        userID: this.state.userID
    };
    let e = yield proxy.wxDemo2.newExercise(param);
    return result(this, {code: 900, e_id: e.e_id, group: e.group});
};

//获取练习的下一道题
exports.getNextQuestion = function *(next) {
    let q_id = yield proxy.wxDemo2.nextEQuestion(this.params.e_id);
    return result(this, {code: 900, q_id});
};

//根据ID获取问题
exports.getQuestion = function *(next) {
    let q = yield proxy.wxDemo2.getQuestionByID(this.params.q_id);
    return result(this, {code: 900, info: q.toInfo()});
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
    yield proxy.wxDemo2.check(param);
    return result(this, {code: 900});
};

//获取用户答题成绩信息以及填写的个人信息
exports.getUserExerciseInfo = function *(next) {
    let user = yield proxy.Student.getUserById(this.state.userID);
    let fill = yield proxy.wxDemo2.getUserFillInfo(this.state.userID);
    let e = yield proxy.wxDemo2.getExerciseByID(this.params.e_id);
    let target = yield proxy.wxDemo1.getHighSchoolById(fill.target_id);
    let info = {
        name: user.nick,
        avatar: user.avatar,
        score: e.score,
        target_point: target.point,
        target_main_point: target.main_subject_point,
        target_math_point: target.math_point,
    };
    return result(this, {code: 900, info});
};

//报告封面
exports.getReportCover = function *(next) {
    let info = yield proxy.wxDemo2.reportCover(this.params.e_id);
    return result(this, {code: 900, info});
};

//试卷分析(OK)
exports.getPaperAnalysis = function *(next) {
    let info = yield proxy.wxDemo2.paperAnalysis(this.params.e_id);
    return result(this, {code: 900, info});
};

//成绩分析(OK)
exports.getResultAnalysis = function *(next) {
    let e = yield proxy.wxDemo2.getExerciseByID(this.params.e_id);
    // let fill = yield proxy.wxDemo2.getUserFillInfo(this.state.userID);
    let info = {
        score: e.score,
        // main_score: fill.main_point,
        average_score: 79,
        // total_student: 6729,
        // rank: 2086,
        // question_quantity: 31,
        // question_correct: 18,
        list: e.list,
        compare_list: [
            {
                type: 'average',
                list: [{
                    difficulty: 1,
                    rate: 75
                }, {
                    difficulty: 2,
                    rate: 67.5
                }, {
                    difficulty: 3,
                    rate: 12
                }, {
                    difficulty: 4,
                    rate: 5
                }]
            }, {
                type: 'provinceKeySchool',
                list: [{
                    difficulty: 1,
                    rate: 98.2
                }, {
                    difficulty: 2,
                    rate: 97
                }, {
                    difficulty: 3,
                    rate: 82.5
                }, {
                    difficulty: 4,
                    rate: 60
                }]
            }, {
                type: 'cityKeySchool',
                list: [{
                    difficulty: 1,
                    rate: 84
                }, {
                    difficulty: 2,
                    rate: 79
                }, {
                    difficulty: 3,
                    rate: 40.5
                }, {
                    difficulty: 4,
                    rate: 7.5
                }]
            }]
    };
    return result(this, {code: 900, info});
};

//排名分析(OK)
exports.getRankAnalysis = function *(next) {
    let e = yield proxy.wxDemo2.getExerciseByID(this.params.e_id);
    let fill = yield proxy.wxDemo2.getUserFillInfo(this.state.userID);
    let info = {
        user: {
            math_score: e.score,
            main_score: fill.main_point
        },
        list: [
            {
                school_name: '辽宁省实验中学',
                math_score: 117,
                main_score: 337,
                list: [{
                    year: '2016',
                    total_score: 726,
                    admitted_students: 500
                }, {
                    year: '2015',
                    total_score: 719,
                    admitted_students: 520
                }, {
                    year: '2014',
                    total_score: 718,
                    admitted_students: 496
                }, {
                    year: '2013',
                    total_score: 722,
                    admitted_students: 514
                }, {
                    year: '2012',
                    total_score: 722,
                    admitted_students: 504
                }]
            }, {
                school_name: '东北育才中学',
                math_score: 116,
                main_score: 341,
                list: [{
                    year: '2016',
                    total_score: 721.8,
                    admitted_students: 70
                }, {
                    year: '2015',
                    total_score: 715,
                    admitted_students: 86
                }, {
                    year: '2014',
                    total_score: 714,
                    admitted_students: 56
                }, {
                    year: '2013',
                    total_score: 714,
                    admitted_students: 71
                }, {
                    year: '2012',
                    total_score: 718,
                    admitted_students: 102
                }]
            }, {
                school_name: '沈阳第二十中学',
                math_score: 115,
                main_score: 341,
                list: [{
                    year: '2016',
                    total_score: 720,
                    admitted_students: 450
                }, {
                    year: '2015',
                    total_score: 712,
                    admitted_students: 456
                }, {
                    year: '2014',
                    total_score: 696,
                    admitted_students: 408
                }, {
                    year: '2013',
                    total_score: 713,
                    admitted_students: 437
                }, {
                    year: '2012',
                    total_score: 711,
                    admitted_students: 425
                }]
            }, {
                school_name: '沈阳市第120中学',
                math_score: 114,
                main_score: 338,
                list: [{
                    year: '2016',
                    total_score: 719,
                    admitted_students: 360
                }, {
                    year: '2015',
                    total_score: 711,
                    admitted_students: 349
                }, {
                    year: '2014',
                    total_score: 694,
                    admitted_students: 328
                }, {
                    year: '2013',
                    total_score: 706,
                    admitted_students: 361
                }, {
                    year: '2012',
                    total_score: 710,
                    admitted_students: 359
                }]
            }, {
                school_name: '沈阳第一中学',
                math_score: 115,
                main_score: 327,
                list: [{
                    year: '2016',
                    total_score: 717,
                    admitted_students: 436
                }, {
                    year: '2015',
                    total_score: 709,
                    admitted_students: 416
                }, {
                    year: '2014',
                    total_score: 680,
                    admitted_students: 423
                }, {
                    year: '2013',
                    total_score: 708,
                    admitted_students: 432
                }, {
                    year: '2012',
                    total_score: 709,
                    admitted_students: 408
                }]
            }
        ]
    };
    return result(this, {code: 900, info});
};

//能力雷达(OK)
exports.getSkillAnalysis = function *(next) {
    let list = yield proxy.wxDemo2.skillAnalysis(this.params.e_id);
    return result(this, {code: 900, list});
};

//知识点分析(OK)
exports.getPointAnalysis = function *(next) {
    let param = {
        userID: this.state.userID,
        e_id: this.params.e_id
    };
    let info = yield proxy.wxDemo2.pointAnalysis(param);
    return result(this, {code: 900, info});
};

//提分策略(OK)
exports.getImproveStrategy = function *(next) {
    let param = {
        userID: this.state.userID,
        e_id: this.params.e_id
    };
    let e = yield proxy.wxDemo2.getExerciseByID(this.params.e_id);
    let fill = yield proxy.wxDemo2.getUserFillInfo(this.state.userID);
    // let info = {
    //     score: e.score,
    //     score_after_improve: 90,
    //     point: [{
    //         point: '数据的收集整理与描述',
    //         difficulty: 3,
    //         current: 45,
    //         reach: 65,
    //         need_time: 3,
    //         improve: 4,
    //         key: [{
    //             point: '切线证明及与多边形'
    //         }]
    //     }, {
    //         point: '一元二次方程',
    //         difficulty: 2,
    //         current: 45,
    //         reach: 65,
    //         need_time: 2,
    //         improve: 2,
    //         key: [{
    //             point: '根的解决方法'
    //         }]
    //     }, {
    //         point: '二次函数',
    //         difficulty: 3,
    //         current: 45,
    //         reach: 65,
    //         need_time: 2,
    //         improve: 2,
    //         key: [{
    //             point: '动点问题及面积的解法'
    //         }]
    //     }]
    // };
    let info = yield proxy.wxDemo2.improveStrategy(param);
    return result(this, {code: 900, info});
};

//知识点图谱
exports.getPointGraph = function *(next) {
    let param = {
        userID: this.state.userID,
        e_id: this.params.e_id
    };
    let list = yield proxy.wxDemo2.pointGraph(param);
    return result(this, {code: 900, list});
};


//获取配置
exports.getConfig = function *(next) {
    let c = yield proxy.wxDemo2.getConfigById('586f44c2320f103448be9e1d');
    return result(this, {code: 900, info: c.toInfo()});
};

//修改配置
exports.editConfig = function *(mext) {
    let c = yield proxy.wxDemo2.getConfigById('586f44c2320f103448be9e1d');
    let body = this.request.body;
    c.score1 = body.score1;
    c.score2 = body.score2;
    c.key1 = body.key1;
    c.key2 = body.key2;
    c.key3 = body.key3;
    c.key4 = body.key4;
    c.key5 = body.key5;
    c.key6 = body.key6;
    c.key7 = body.key7;
    c.key8 = body.key8;
    c.key9 = body.key9;
    yield c.save();
    return result(this, {code: 900, info: c.toInfo()});
};
