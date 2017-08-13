/**
 * Created by MengLei on 2016-12-22.
 */
"use strict";

/**
 * 学生填写信息
 * @param param = {userID: '', school_id: '', school_name: '', math_point: '', target_id: '', target_name: ''}
 * @returns {*}
 */
exports.fillInfo = function *(param) {
    let fill = new (model.wxdemo2UserFillInfo)();
    fill.userID = param.userID;
    fill.school_id = param.school_id;
    fill.rank = param.rank;
    if (param.school_name) {
        fill.school_name = param.school_name;
    } else {
        let school = yield model.wxdemoJuniorSchool.findById(param.school_id);
        fill.school_name = school ? school.name : '';
    }
    fill.math_point = param.math_point;
    fill.main_point = param.main_point;
    fill.rank = param.rank;
    fill.target_id = param.target_id;
    if (param.target_name) {
        fill.target_name = param.target_name;
    } else {
        let school = yield model.wxdemoHighSchool.findById(param.target_id);
        fill.target_name = school ? school.name : '';
    }
    return yield fill.save();
};

/**
 * 获取学生填写信息
 * @param userID
 * @returns {*}
 */
exports.getUserFillInfo = function *(userID) {
    return yield model.wxdemo2UserFillInfo.findOne({userID}).sort({createdAt: -1});
};

/**
 * 学生获取根据最近一次填写内容生成的简单报告
 * @param param = {userID: ''}
 * @returns {{school_id, school_name: (*|string|UserFillSchema.school_name|{type, required}|string), fill_math_point: (*|HignSchoolSchema.math_point|{type, required}|UserFillSchema.math_point), target_id: (*|UserFillSchema.target_id|{type, required}), target_name: (*|UserFillSchema.target_name|{type, required}|string), target_point, target_math_point: (*|HignSchoolSchema.math_point|{type, required}|UserFillSchema.math_point), target_desc: (string|*|string|string|Array|string), gap: number}}
 */
exports.shortReport = function *(param) {
    let fill = yield model.wxdemo2UserFillInfo.findOne({userID: param.userID}).sort({createdAt: -1});
    let target = yield model.wxdemoHighSchool.findById(fill.target_id);
    let gap = fill.math_point - target.math_point;
    let surpass = yield model.wxdemoScore.count({point: {$gte: fill.math_point, $lt: target.math_point}});
    let range = yield rangeList();
    let stat = {   //总体数据，已经预先计算好的
        "total": 53349,
        "highest": 120,
        "average": 89,
        "median": 93.6,
        "variance": 566.2,
        "sd": 23.8,
        "mode": 92.4
    };
    return {
        school_id: fill.school_id,
        school_name: fill.school_name,
        fill_math_point: fill.math_point,
        fill_main_point: fill.main_point,
        target_id: fill.target_id,
        target_name: fill.target_name,
        target_point: target.point,
        target_main_point: target.main_subject_point,
        target_math_point: target.math_point,
        target_desc: target.desc,
        list: range,
        gap: gap,
        stat: stat,
        surpass: surpass
    };
    function avgScore(callback) {
        model.wxdemoScore.aggregate([
            {$match: {year: 2016}},
            {$group: {_id: "$year", avgScore: {$avg: "$point"}}}
        ], (err, resp) => {
            if (err) {
                return callback(err);
            }
            callback(resp[0].avgScore);
        });
    }
};

/**
 * 新建一个练习
 * @param param = {userID: '', num: ''}
 * @return {*}
 */
exports.newExercise = function *(param) {
    yield model.wxdemo2Exercise.update({
        userID: param.userID,
        status: 'pending'
    }, {$set: {status: 'cancel'}}, {multi: true});
    let store = null;
    if (param.num) {
        store = yield model.wxdemo2EStore.findOne({num: param.num});
    }
    if (!store) {
        store = yield model.wxdemo2EStore.findOne({valid: true}).sort({createdAt: -1});
    }
    let pre = yield model.wxdemo2Exercise.findOne({userID: param.userID}).sort({createdAt: -1});
    let e = new (model.wxdemo2Exercise)();
    e.userID = param.userID;
    e.questions = store.questions;
    e.estore_id = store.estore_id;
    e.group = (pre && pre.group) == 'a' ? 'b' : 'a';
    return yield e.save();
};

/**
 * 根据ID获取练习记录
 * @param e_id
 * @returns {*}
 */
exports.getExerciseByID = function *(e_id) {
    return yield model.wxdemo2Exercise.findById(e_id);
};

/**
 * 根据ID获取问题
 * @param q_id
 * @returns {*}
 */
exports.getQuestionByID = function *(q_id) {
    return yield model.wxdemo2Question.findById(q_id);
};

/**
 * 获取下一道题目的ID，如果没有了就返回空
 * @param e_id
 * @returns {string}
 */
exports.nextEQuestion = function *(e_id) {
    let res = yield [
        model.wxdemo2Exercise.findById(e_id),
        model.wxdemo2EStep.findOne({e_id: e_id, status: 'finished'}).sort({createdAt: -1})
    ];
    if (!res[1]) {
        return res[0].questions[0];
    }
    for (let i = 0; i < res[0].questions.length - 1; i++) {
        if (res[0].questions[i].toString() == res[1].q_id.toString()) {
            return res[0].questions[i + 1];
        }
    }
    let e = yield model.wxdemo2Exercise.findByIdAndUpdate(res[0]._id, {$set: {status: 'finished'}}, {new: true});
    //此处发现该次练习已经结束，进行结果的计算
    yield e.calculate();
    return '';
};

/**
 * 每道题答题的流程
 * @param param = {userID: '', e_id: '', q_id: '', choice_id: ''}
 * @returns {*}
 */
exports.check = function *(param) {
    let q = yield model.wxdemo2Question.findById(param.q_id);
    let es = null;
    switch (q.type) {
        case 'question': {
            es = yield model.wxdemo2EStep.findOne({userID: param.userID, e_id: param.e_id, q_id: param.q_id});
            if (!es) {
                es = new (model.wxdemo2EStep)();
                es.userID = param.userID;
                es.e_id = param.e_id;
                es.q_id = param.q_id;
                es.type = 'question';
            }
            es.choice_id = param.choice_id;
            es.status = 'finished';
            es.correct = !!q.choice.id(param.choice_id).correct;
        }
            break;
        case 'root': {
            es = yield model.wxdemo2EStep.findOne({userID: param.userID, e_id: param.e_id, q_id: param.q_id});
            if (!es) {
                es = new (model.wxdemo2EStep)();
                es.e_id = param.e_id;
                es.userID = param.userID;
                es.q_id = param.q_id;
                es.type = 'root';
            }
            es.steps = [];  //重置所有步骤
        }
            break;
        case 'step': {
            es = yield model.wxdemo2EStep.findOne({userID: param.userID, e_id: param.e_id, q_id: q.root_id});
            if (!es) {
                es = new (model.wxdemo2EStep)();
                es.type = 'root';
                es.userID = param.userID;
                es.e_id = param.e_id;
                es.q_id = q.root_id;
            }
            es.steps.push({
                q_id: param.q_id,
                correct: !!q.choice.id(param.choice_id).correct,
                choice_id: param.choice_id
            });
            if (!q.next) {
                es.status = 'finished';
            }
        }
            break;
    }
    return yield es.save();
};

/**
 * 根据练习ID获取对应练习报告的封面
 * @param e_id
 * @returns {*}
 */
exports.reportCover = function *(e_id) {
    let c = yield model.wxdemo2Config.findById('586f44c2320f103448be9e1d');
    let e = yield model.wxdemo2Exercise.findById(e_id);
    let user = yield model.UserS.findById(e.userID);
    let info = {
        name: user.nick,
        avatar: user.avatar,
        score: e.score,
        desc1: '',
        desc2: '',
        desc3: ''
    };
    let day = 15;
    let improveMin = 1;
    let improveMax = 5;
    if (e.score > c.score1) {
        info.desc1 = c.key1;
        info.desc2 = c.key2;
        info.desc3 = c.key3;
    } else if (e.score > c.score2) {
        info.desc1 = c.key4;
        info.desc2 = c.key5;
        info.desc3 = c.key6;
    } else {
        info.desc1 = c.key7;
        info.desc2 = c.key8;
        info.desc3 = c.key9;
    }
    if (e.score < 110) {
        improveMin = 110 - e.score;
        improveMax = 120 - e.score;
        day = Number.parseInt(Math.ceil((1.2 * improveMin) / 10).toFixed(0)) * 10;
    }
    info.desc1 = info.desc1.replace(/\{\{name}}/g, user.nick).replace(/\{\{day}}/g, day.toString()).replace(/\{\{improveMin}}/g, improveMin.toString()).replace(/\{\{improveMax}}/g, improveMax.toString());
    info.desc2 = info.desc2.replace(/\{\{name}}/g, user.nick).replace(/\{\{day}}/g, day.toString()).replace(/\{\{improveMin}}/g, improveMin.toString()).replace(/\{\{improveMax}}/g, improveMax.toString());
    info.desc3 = info.desc3.replace(/\{\{name}}/g, user.nick).replace(/\{\{day}}/g, day.toString()).replace(/\{\{improveMin}}/g, improveMin.toString()).replace(/\{\{improveMax}}/g, improveMax.toString());
    return info;
};

/**
 * 根据ID获取配置信息
 * @param config_id
 * @returns {*}
 */
exports.getConfigById = function *(config_id) {
    return yield model.wxdemo2Config.findById(config_id);
};


/**
 * 试卷分析
 * @param e_id
 * @returns {Object}
 */
exports.paperAnalysis = function *(e_id) {
    let e = yield model.wxdemo2Exercise.findById(e_id);
    let estore = yield model.wxdemo2EStore.findById(e.estore_id);
    let info = estore.toObject().info;
    info.question_quantity = estore.questions.length;
    return info;
};

/**
 * 提分策略
 * @param {*} param = {userID: '', e_id: ''}
 * @returns {Object}
 */
exports.improveStrategy = function *(param) {
    let fill = yield model.wxdemo2UserFillInfo.findOne({userID: param.userID}).sort({createdAt: -1});
    let e = yield model.wxdemo2Exercise.findById(param.e_id);
    let target = yield model.wxdemoHighSchool.findById(fill.target_id);
    let info = {
        score: e.score,
        improve_list: [],
        point: []
    };
    if (target.math_point > e.score) {
        info.improve_list.push({school_id: target.school_id, school_name: target.name, math_score: target.math_point});
        let middle_score = (e.score + target.math_point) / 2;
        let middle_up = yield model.wxdemoHighSchool.findOne({math_point: {$gte: middle_score}}).sort({math_point: 1});
        let middle_down = yield model.wxdemoHighSchool.findOne({math_point: {$lte: middle_score}}).sort({math_point: -1});
        let middle = middle_down.math_point - e.score > middle_up.math_point - e.score ? middle_up : middle_down;
        info.improve_list.push({school_id: middle.school_id, school_name: middle.name, math_score: middle.math_point});
    } else {
        let up = yield model.wxdemoHighSchool.findOne({}).sort({math_point: -1});
        let middle = yield model.wxdemoHighSchool.findOne({math_point: {$lte: (up.math_point + e.score) / 2}}).sort({math_point: -1});
        info.improve_list.push({school_id: up.school_id, school_name: up.name, math_score: up.math_point});
        info.improve_list.push({school_id: middle.school_id, school_name: middle.name, math_score: middle.math_point});
    }
    let sub_points = e.toObject().point_list.filter(i => i.type == 'sub_point').filter(i => i.correct < i.quantity);
    for (let i = 0; i < sub_points.length; i++) {
        let items = e.point_list.filter(ii => ii.sub_id == sub_points[i].point_id);
        items.sort((a, b) => a.correct / a.quantity < b.correct / b.quantity);
        sub_points[i].key = [];
        if (items.length > 0) {
            sub_points[i].key = items.map(ii => ii.content);
        }
        let root = yield model.wxdemo2Point.findById(sub_points[i].root_id);
        sub_points[i].root_content = root.content;
        sub_points[i].max_improve = Number.parseInt(((sub_points[i].total_score - sub_points[i].score) * ((sub_points[i].score / sub_points[i].total_score) < 0.5 ? 0.8 : 0.1)).toFixed(0));
        sub_points[i].min_improve = Number.parseInt((sub_points[i].max_improve / 2).toFixed(0));
        sub_points[i].time = Math.ceil(sub_points[i].max_improve * sub_points[i].difficulty * 1.2);
    }
    info.point = sub_points;
    return info;
};

/**
 * 技能分析
 * @param e_id
 * @returns {*}
 */
exports.skillAnalysis = function *(e_id) {
    let e = yield model.wxdemo2Exercise.findById(e_id);
    return e.toObject().skill_list;
};

/**
 * 知识点分析
 * @param param = {userID: '', e_id: ''}
 * @returns {*}
 */
exports.pointAnalysis = function *(param) {
    let e = yield model.wxdemo2Exercise.findById(param.e_id);
    let point_list = e.toObject().point_list.filter(i => i.type == 'point' || i.type == 'sub_point');
    let list = point_list.filter(i => i.type == 'point');
    for (let i = 0; i < list.length; i++) {
        list[i].list = [];
        for (let j = 0; j < point_list.length; j++) {
            if (list[i].point_id == point_list[j].root_id) {
                list[i].list.push(point_list[j]);
            }
        }
    }
    return {score: e.score, list};
};

//知识点图谱
exports.pointGraph = function *(param) {
    let e = yield model.wxdemo2Exercise.findById(param.e_id);
    // let list = [];
    // let sub_count = [
    //     {point_id: '585b6b2238eccc257427afc9', quantity: 10, correct: 8},
    //     {point_id: '585b6b3f52ecda39dc43b10a', quantity: 8, correct: 4},
    //     {point_id: '585b6bab737b0a38a06c4c2d', quantity: 0, correct: 0},
    //     {point_id: '585b8643fe334931942e948c', quantity: 3, correct: 2},
    //     {point_id: '585b86646a866b1504aa84b3', quantity: 5, correct: 3},
    //     {point_id: '585b86c69a6d7343385266ee', quantity: 4, correct: 1},
    //     {point_id: '585b86cd3a9d6400e45882d1', quantity: 5, correct: 2},
    //     {point_id: '585b86d9aee8702ba49e43e4', quantity: 5, correct: 3},
    //     {point_id: '585b8718248ecd37e0a304c7', quantity: 5, correct: 3},
    //     {point_id: '585b88d6456d4c23a4d36782', quantity: 5, correct: 4},
    //     {point_id: '585b88f41b29203328f9e35b', quantity: 4, correct: 1},
    //     {point_id: '585b890f4382d809a89fd087', quantity: 0, correct: 0},
    //     {point_id: '585b89798ca0db29a87114c4', quantity: 5, correct: 5},
    //     {point_id: '585b898734c43c31946cb9e1', quantity: 5, correct: 5},
    //     {point_id: '585b89c8aa07de29cc203841', quantity: 3, correct: 1},
    //     {point_id: '585b89dde4d1023ee09788f8', quantity: 5, correct: 3},
    //     {point_id: '585b89f564cdf818e49eaec6', quantity: 0, correct: 0},
    //     {point_id: '585b8a12f9b1fe3a2cebc7c1', quantity: 4, correct: 4},
    //     {point_id: '585b8bfa64050a21ec8242fe', quantity: 5, correct: 3},
    //     {point_id: '585b8c0bd5de693ec49f7072', quantity: 5, correct: 1},
    //     {point_id: '585b8c50a1be053830769681', quantity: 0, correct: 0},
    //     {point_id: '585b8eb4236cbb1e58fb3ca8', quantity: 3, correct: 3},
    //     {point_id: '585b8ec98214ac1674713802', quantity: 0, correct: 0},
    //     {point_id: '585b8edc9bd0110b74feabb3', quantity: 0, correct: 0},
    //     {point_id: '585b8f0b9ca8df41bc83161f', quantity: 4, correct: 4},
    //     {point_id: '585b8f31ad9c8e43e455df40', quantity: 3, correct: 3},
    //     {point_id: '585b8f3b5d2782201cc26358', quantity: 3, correct: 2},
    //     {point_id: '585b8f551f615c0214240ccd', quantity: 3, correct: 3},
    //     {point_id: '585b8f602a543c28d852db52', quantity: 3, correct: 1},
    //     {point_id: '585b8f6c6483e5397c4074fe', quantity: 3, correct: 1},
    //     {point_id: '585b8f799eedd839c42fef96', quantity: 3, correct: 1},
    //     {point_id: '585b8fbd01d4673834e3bbaf', quantity: 3, correct: 2},
    //     {point_id: '585b8fe8d1821d13849a3ca8', quantity: 2, correct: 4},
    //     {point_id: '585b8ffd322eb612a053333a', quantity: 5, correct: 4},
    //     {point_id: '585b900cae26aa42d86b07a2', quantity: 4, correct: 5}
    // ];
    // let sub_ids = new Set();
    // for (let i = 0; i < sub_count.length; i++) {
    //     let p = yield model.wxdemo2Point.findById(sub_count[i].point_id);
    //     let pSub = yield p.toSubPoint();
    //     sub_ids.add(pSub.point_id);
    // }
    // for (let id of sub_ids) {
    //     let pSub = yield model.wxdemo2Point.findById(id);
    //     let thisList = yield pSub.toFullSubList();
    //     list = list.concat(thisList);
    // }
    // for (let i = 0; i < list.length; i++) {
    //     for (let j = 0; j < sub_count.length; j++) {
    //         if (list[i].point_id == sub_count[j].point_id) {
    //             list[i].quantity = sub_count[j].quantity;
    //             list[i].correct = sub_count[j].correct;
    //         }
    //     }
    // }
    // for (let i = 0; i < list.length; i++) {
    //     if (list[i].type == 'item') {
    //         list[i].quantity = 0;
    //         list[i].correct = 0;
    //         console.log(`parent content: ${list[i].content}, quantity: ${list[i].quantity}`);
    //         for (let j = 0; j < list.length; j++) {
    //             if (list[i].point_id == list[j].parent_id) {
    //                 list[i].quantity += list[j].quantity;
    //                 list[i].correct += list[j].correct;
    //                 console.log(`parent content: ${list[i].content}, quantity: ${list[i].quantity}, this content: ${list[j].content}, quantity: ${list[j].quantity}`);
    //             }
    //         }
    //         console.log(`parent content: ${list[i].content}, quantity: ${list[i].quantity}`);
    //     }
    // }
    // for (let i = 0; i < list.length; i++) {
    //     if (list[i].type == 'sub_point') {
    //         list[i].quantity = 0;
    //         list[i].correct = 0;
    //         console.log(`parent content: ${list[i].content}, quantity: ${list[i].quantity}`);
    //         for (let j = 0; j < list.length; j++) {
    //             // console.log(`parent content: ${list[i].content}, quantity: ${list[i].quantity}, this content: ${list[j].content}, quantity: ${list[j].quantity}`);
    //             if (list[i].point_id == list[j].parent_id) {
    //                 list[i].quantity += list[j].quantity;
    //                 list[i].correct += list[j].correct;
    //                 console.log(`parent content: ${list[i].content}, quantity: ${list[i].quantity}, this content: ${list[j].content}, quantity: ${list[j].quantity}`);
    //             }
    //         }
    //         console.log(`parent content: ${list[i].content}, quantity: ${list[i].quantity}`);
    //     }
    // }
    // for (let i = 0; i < list.length; i++) {
    //     if (list[i].type == 'point') {
    //         list[i].quantity = 0;
    //         list[i].correct = 0;
    //         console.log(`parent content: ${list[i].content}, quantity: ${list[i].quantity}`);
    //         for (let j = 0; j < list.length; j++) {
    //             if (list[i].point_id == list[j].parent_id) {
    //                 list[i].quantity += list[j].quantity;
    //                 list[i].correct += list[j].correct;
    //                 console.log(`parent content: ${list[i].content}, quantity: ${list[i].quantity}, this content: ${list[j].content}, quantity: ${list[j].quantity}`);
    //             }
    //         }
    //         console.log(`parent content: ${list[i].content}, quantity: ${list[i].quantity}`);
    //     }
    // }
    return e.toObject().point_list;
};


function* rangeList() {
    let res = yield [
        model.wxdemoScore.count({point: {$gte: 0, $lte: 10}}),
        model.wxdemoScore.count({point: {$gt: 10, $lte: 20}}),
        model.wxdemoScore.count({point: {$gt: 20, $lte: 30}}),
        model.wxdemoScore.count({point: {$gt: 30, $lte: 40}}),
        model.wxdemoScore.count({point: {$gt: 40, $lte: 50}}),
        model.wxdemoScore.count({point: {$gt: 50, $lte: 60}}),
        model.wxdemoScore.count({point: {$gt: 60, $lte: 70}}),
        model.wxdemoScore.count({point: {$gt: 70, $lte: 80}}),
        model.wxdemoScore.count({point: {$gt: 80, $lte: 90}}),
        model.wxdemoScore.count({point: {$gt: 90, $lte: 100}}),
        model.wxdemoScore.count({point: {$gt: 100, $lte: 110}}),
        model.wxdemoScore.count({point: {$gt: 110, $lte: 120}})
    ];
    return [
        {range: '0-10', count: res[0]},
        {range: '10-20', count: res[1]},
        {range: '20-30', count: res[2]},
        {range: '30-40', count: res[3]},
        {range: '40-50', count: res[4]},
        {range: '50-60', count: res[5]},
        {range: '60-70', count: res[6]},
        {range: '70-80', count: res[7]},
        {range: '80-90', count: res[8]},
        {range: '90-100', count: res[9]},
        {range: '100-110', count: res[10]},
        {range: '110-120', count: res[11]}
    ]
}