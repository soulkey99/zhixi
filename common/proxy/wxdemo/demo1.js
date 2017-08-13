/**
 * Created by MengLei on 2016-12-01.
 */
"use strict";

/**
 * 获取初中列表
 * @param param = {key: ''}
 * @return {Array}
 */
exports.juniorSchoolList = function *(param) {
    let query = {};
    if (param && param.key) {
        query = {$or: [{name: {$regex: param.key}}, {key: {$regex: param.key}}]};
    }
    let res = yield model.wxdemoJuniorSchool.find(query);
    return res.map(i => i.toInfo());
};

/**
 * 获取高中列表
 * @param {Object} [param]
 * @return {Array}
 */
exports.highSchoolList = function *(param) {
    let query = {};
    if (param && param.key) {
        query = {$or: [{name: {$regex: param.key}}, {key: {$regex: param.key}}]};
    }
    let res = yield model.wxdemoHighSchool.find(query);
    return res.map(i => i.toSimpleInfo());
};
/**
 * 添加新的高中
 * @param param = {name: '', point: '', code: '', main_subject_point: '', language: '', key: ''}
 * @return {*}
 */
exports.addHighSchool = function *(param) {
    let hs = new (model.wxdemoHighSchool)();
    hs.name = param.name;
    hs.point = param.point;
    hs.code = param.code;
    hs.main_subject_point = param.main_subject_point;
    hs.math_point = param.math_point;
    hs.language_point = param.language_point;
    hs.key = [];
    hs.level = hs.point >= 720 ? 1 : hs.point >= 700 ? 2 : 3;
    return yield hs.save();
};

/**
 * 添加新的初中
 * @param param = {name: '', key: ''}
 * @returns {*}
 */
exports.addJuniorSchool = function *(param) {
    let js = new (model.wxdemoJuniorSchool)();
    js.name = param.name;
    js.key = [];
    return yield js.save();
};

/**
 * 获取高中的一条记录
 * @param school_id
 * @returns {*}
 */
exports.getHighSchoolById = function *(school_id) {
    return yield model.wxdemoHighSchool.findById(school_id);
};

/**
 * 添加问题
 * @param param = {type: '', content: '', choice: '', point: '', difficulty: '', remark: ''}
 * @returns {*}
 */
exports.addQuestion = function *(param) {
    let q = new (model.wxdemoQuestion)();
    q.type = param.type;
    switch (param.type) {
        case 'question': {
            q.content = param.content;
            q.choice = param.choice;
            q.point = param.point;
            q.difficulty = param.difficulty;
            q.remark = param.remark;
        }
            break;
        case 'root': {
            q.content = param.content;
            q.point = param.point;
            q.difficulty = param.difficulty;
            q.remark = param.remark;
        }
            break;
        case 'step': {
            q.root_id = param.root_id;
            q.content = param.content;
            q.choice = param.choice;
            q.remark = param.remark;
        }
            break;
        default:
            throw(new Error('question type error.'));
            break;
    }
    return yield q.save();
};

/**
 * 根据ID获取问题
 * @param q_id
 * @returns {*}
 */
exports.getQuestionByID = function *(q_id) {
    return yield model.wxdemoQuestion.findById(q_id);
};

/**
 * 根据ID获取练习记录
 * @param e_id
 * @returns {*}
 */
exports.getExerciseByID = function *(e_id) {
    return yield model.wxdemoExercise.findById(e_id);
};

/**
 * 学生填写信息
 * @param param = {userID: '', school_id: '', school_name: '', math_point: '', target_id: '', target_name: ''}
 * @returns {*}
 */
exports.fillInfo = function *(param) {
    let fill = new (model.wxdemoUserFillInfo)();
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
 * 学生获取根据最近一次填写内容生成的简单报告
 * @param param = {userID: ''}
 * @returns {{school_id, school_name: (*|string|UserFillSchema.school_name|{type, required}|string), fill_math_point: (*|HignSchoolSchema.math_point|{type, required}|UserFillSchema.math_point), target_id: (*|UserFillSchema.target_id|{type, required}), target_name: (*|UserFillSchema.target_name|{type, required}|string), target_point, target_math_point: (*|HignSchoolSchema.math_point|{type, required}|UserFillSchema.math_point), target_desc: (string|*|string|string|Array|string), gap: number}}
 */
exports.shortReport = function *(param) {
    let fill = yield model.wxdemoUserFillInfo.findOne({userID: param.userID}).sort({createdAt: -1});
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
        target_id: fill.target_id,
        target_name: fill.target_name,
        target_point: target.point,
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
 * @returns {*}
 */
exports.newExercise = function *(param) {
    yield model.wxdemoExercise.update({
        userID: param.userID,
        status: 'pending'
    }, {$set: {status: 'cancel'}}, {multi: true});
    let store = null;
    if (param.num) {
        store = yield model.wxdemoEStore.findOne({num: param.num});
    }
    if (!store) {
        store = yield model.wxdemoEStore.findOne({valid: true}).sort({createdAt: -1});
    }
    let pre = yield model.wxdemoExercise.findOne({userID: param.userID}).sort({createdAt: -1});
    let e = new (model.wxdemoExercise)();
    e.userID = param.userID;
    e.questions = store.questions;
    e.group = pre && pre.group == 'a' ? 'b' : 'a';
    return yield e.save();
};

/**
 * 获取下一道题目的ID，如果没有了就返回空
 * @param e_id
 * @returns {string}
 */
exports.nextEQuestion = function *(e_id) {
    let res = yield [
        model.wxdemoExercise.findById(e_id),
        model.wxdemoEStep.findOne({e_id: e_id}).sort({createdAt: -1})
    ];
    if (!res[1]) {
        return res[0].questions[0];
    }
    for (let i = 0; i < res[0].questions.length - 1; i++) {
        if (res[0].questions[i].toString() == res[1].q_id.toString()) {
            return res[0].questions[i + 1];
        }
    }
    yield model.wxdemoExercise.findByIdAndUpdate(res[0]._id, {$set: {status: 'finished'}});
    return '';
};

/**
 * 每道题答题的流程
 * @param param = {userID: '', e_id: '', q_id: '', choice_id: ''}
 * @returns {*}
 */
exports.check = function *(param) {
    let q = yield model.wxdemoQuestion.findById(param.q_id);
    let es = null;
    switch (q.type) {
        case 'question': {
            es = yield model.wxdemoEStep.findOne({userID: param.userID, e_id: param.e_id, q_id: param.q_id});
            if (!es) {
                es = new (model.wxdemoEStep)();
                es.userID = param.userID;
                es.e_id = param.e_id;
                es.q_id = param.q_id;
                es.type = 'question';
            }
            es.choice_id = param.choice_id;
            es.correct = !!q.choice.id(param.choice_id).correct;
        }
            break;
        case 'root': {
            es = yield model.wxdemoEStep.findOne({userID: param.userID, e_id: param.e_id, q_id: param.q_id});
            if (!es) {
                es = new (model.wxdemoEStep)();
                es.e_id = param.e_id;
                es.userID = param.userID;
                es.q_id = param.q_id;
                es.type = 'root';
            }
            es.steps = [];  //重置所有步骤
        }
            break;
        case 'step': {
            es = yield model.wxdemoEStep.findOne({userID: param.userID, e_id: param.e_id, q_id: q.root_id});
            if (!es) {
                es = new (model.wxdemoEStep)();
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
        }
            break;
    }
    return yield es.save();
};

/**
 * 练习结束获取最后的报告
 * @param e_id
 * @returns {{point: Array, skill: Array, math_point: number, list: *, target_id: (*|UserFillSchema.target_id|{type, required}), target_name: (*|UserFillSchema.target_name|{type, required}|string), target_point, target_math_point: (number|*|UserFillSchema.math_point|{type, required}|HignSchoolSchema.math_point), gap: number, surpass: *}}
 */
exports.getReport = function *(e_id) {
    let e = yield model.wxdemoExercise.findById(e_id);
    let es = yield model.wxdemoEStep.find({e_id});
    let total = e.questions.length;  //总题目数
    let correct = 0;   //正确题目数
    let partial_correct = 0;  //部分正确题目数
    let math_point = 0;
    let point = {};
    let skill = {};
    for (let i = 0; i < e.questions.length; i++) {  //计算本次测试的成绩统计数据
        let q = yield model.wxdemoQuestion.findById(e.questions[i]);
        if (q.type == 'question') {  //计算普通单选答题数据
            stat(q);
            for (let j = 0; j < es.length; j++) {
                if (q.q_id.toString() == es[j].q_id.toString()) {
                    if (es[j].correct) {  //本题是否答对，如果答对，就在这里加1
                        correct++;
                    }
                    calc(q, es[j]);
                }
            }
        } else if (q.type == 'root') {    //计算分布答题数据
            for (let j = 0; j < es.length; j++) {
                if (q.q_id.toString() == es[j].q_id.toString()) {
                    let total_steps = 0;    //本题总步数
                    let correct_steps = 0;  //本题答对步数
                    let next_id = q.next;
                    while (next_id) {
                        let qNext = yield model.wxdemoQuestion.findById(next_id);
                        total_steps++;
                        stat(qNext);
                        for (let k = 0; k < es[j].steps.length; k++) {
                            if (qNext.q_id.toString() == es[j].steps[k].q_id.toString()) {
                                if (es[j].steps[k].correct) {
                                    correct_steps++;
                                }
                                calc(qNext, es[j].steps[k]);
                            }
                        }
                        next_id = qNext.next;
                    }
                    if (correct_steps == total_steps) {  //完全正确
                        correct++;
                    } else if (correct_steps == 0) {   //完全错误
                        //
                    } else {   //部分正确
                        partial_correct++;
                    }
                }
            }
        }
    }
    yield model.wxdemoEScore.findOneAndUpdate({e_id}, {
        $set: {point: math_point},
        $setOnInsert: {userID: e.userID, year: '2016'}
    }, {upsert: true});
    let avgRes = yield avgScore({year: 2016});
    let average = Number.parseFloat(avgRes[0].avgScore.toFixed(1));
    let ETotal = yield model.wxdemoScore.count();  //去年中考总人数
    let rank = yield model.wxdemoScore.count({point: {$gt: math_point}});   //我本次测试成绩在去年中考成绩中的排名
    let fill = yield model.wxdemoUserFillInfo.findOne({userID: e.userID}).sort({createdAt: -1});    //获取填写信息
    let target = yield model.wxdemoHighSchool.findById(fill.target_id); //通过ID获取目标学校记录
    let gap = math_point - target.math_point;   //得分与所填写目标的差异
    let need_surpass = yield model.wxdemoScore.count({point: {$gte: math_point, $lt: target.math_point}});  //本次测试得分与填写的目标成绩需要超越的学生
    let range = yield rangeList();
    let pKey = Object.keys(point);
    let sKey = Object.keys(skill);
    let point_list = [];
    let skill_list = [];
    for (let i = 0; i < pKey.length; i++) {
        let p = yield model.wxdemoPoint.findById(pKey[i]);
        let item = {
            point_id: p.point_id,
            content: p.content,
            total: point[p.point_id].total,
            correct: point[p.point_id].correct,
            wrong: point[p.point_id].wrong
        };
        if (target.math_point > 110) {
            item.target_rate = p.rate1;
        } else if (target.math_point > 100) {
            item.target_rate = p.rate2;
        } else if (target.math_point > 90) {
            item.target_rate = p.rate3;
        } else {
            item.target_rate = p.rate4;
        }
        item.rate = Number.parseFloat((item.correct / item.total * 100).toFixed(1));
        point_list.push(item);
    }
    for (let i = 0; i < sKey.length; i++) {
        let s = yield model.wxdemoSkill.findById(sKey[i]);
        let item = {
            skill_id: s.skill_id,
            content: s.content,
            total: skill[s.skill_id].total,
            correct: skill[s.skill_id].correct,
            wrong: skill[s.skill_id].wrong
        };
        item.rate = Number.parseFloat((item.correct / item.total * 100).toFixed(1));
        if (item.rate == 100) {
            item.flag = 'A+';
            item.desc = s.level1;
        } else if (item.rate > 80) {
            item.flag = 'A';
            item.desc = s.level2;
        } else if (item.rate > 60) {
            item.flag = 'B';
            item.desc = s.level3;
        } else if (item.rate > 40) {
            item.flag = 'C';
            item.desc = s.level4;
        } else {
            item.flag = 'D';
            item.desc = s.level5;
        }
        if (target.math_point > 110) {
            item.target_rate = s.rate1;
        } else if (target.math_point > 100) {
            item.target_rate = s.rate2;
        } else if (target.math_point > 90) {
            item.target_rate = s.rate3;
        } else {
            item.target_rate = s.rate4;
        }
        skill_list.push(item);
    }
    return {
        point: point_list,   //知识点数据列表
        skill: skill_list,   //技能数据列表
        math_point: math_point,   //本次测试得分
        list: range,        //得分分布情况
        target_id: fill.target_id,   //填写目标的ID
        target_name: fill.target_name,    //填写目标学校名称
        target_point: target.point,       //目标学校的录取分数
        target_math_point: target.math_point,    //目标学校的数学录取分
        question_total: total,            //总题目数
        question_correct: correct,           //答对题目数
        question_partial_correct: partial_correct,   //部分答对题目数
        gap: gap,    //得分差距
        average: average,    //本次测试的平均分
        total: ETotal,    //本次测试人数
        rank: rank + 1,    //本次测试排名
        need_surpass: need_surpass      //达到目标学校需要超越的人数
    };

    function stat(q) {
        // console.log(`stat q_id: ${q.q_id}, type: ${q.type}, q point length: ${q.point.length}`);
        for (let i = 0; i < q.point.length; i++) {
            if (!point[q.point[i].toString()]) {
                point[q.point[i].toString()] = {total: 0, correct: 0, wrong: 0};
            }
            point[q.point[i].toString()].total++;
        }
        for (let i = 0; i < q.skill.length; i++) {
            if (!skill[q.skill[i].toString()]) {
                skill[q.skill[i].toString()] = {total: 0, correct: 0, wrong: 0};
            }
            skill[q.skill[i].toString()].total++;
        }
    }

    function calc(q, eItem) {
        // console.log(`calc q_id: ${q.q_id}, type: ${q.type}`);
        if (eItem.correct) {
            math_point += q.score;
        }
        for (let i = 0; i < q.point.length; i++) {
            point[q.point[i].toString()][eItem.correct ? 'correct' : 'wrong']++;
        }
        for (let i = 0; i < q.skill.length; i++) {
            skill[q.skill[i].toString()][eItem.correct ? 'correct' : 'wrong']++;
        }
    }

    function avgScore(query, callback) {
        return function (callback) {
            model.wxdemoScore.aggregate([
                {$match: query},
                {$group: {_id: "$year", avgScore: {$avg: "$point"}}}
            ], callback);
        };
    }
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

function *calcStat() {   //计算去年考试分数分布信息表格
    /**  表格样式
     *  |总考生|最高分|平均分|中位数|众数|标准差|
     *  |      |      |      |      |    |      |
     */
    let stat = {
        total: yield model.wxdemoScore.count({year: 2016})
    };
    let highRes = yield model.wxdemoScore.findOne({year: 2016}).sort({point: -1});
    stat.highest = highRes.point;
    let avgRes = yield avgScore({year: 2016});
    stat.average = Number.parseFloat((avgRes[0].avgScore).toFixed(1));
    let medianRes = yield model.wxdemoScore.findOne({year: 2016}).sort({point: -1}).skip(Math.round(stat.total / 2));
    stat.median = medianRes.point;
    let allRes = yield model.wxdemoScore.find({year: 2016});
    let scoreStat = {};
    let varianceTotal = 0;
    for (let i = 0; i < allRes.length; i++) {
        if (!scoreStat[allRes[i].point]) {
            scoreStat[allRes[i].point] = 0;
        }
        scoreStat[allRes[i].point]++;
        varianceTotal += (allRes[i].point - stat.average) * (allRes[i].point - stat.average);
    }
    stat.variance = Number.parseFloat((varianceTotal / allRes.length).toFixed(1));  //方差
    stat.sd = Number.parseFloat(Math.sqrt(stat.variance).toFixed(1));   //标准差
    let scoreKeys = Object.keys(scoreStat);
    let scoreList = [];
    for (let i = 0; i < scoreKeys.length; i++) {
        scoreList.push({score: scoreKeys[i], count: scoreStat[scoreKeys[i]]});
    }
    scoreList.sort((a, b) => b.count - a.count);  //所有分数出现次数排序
    stat.mode = Number.parseFloat(scoreList[0].score);   //出现次数最多的分数
    return stat;
    function avgScore(query, callback) {
        return function (callback) {
            model.wxdemoScore.aggregate([
                {$match: query},
                {$group: {_id: "$year", avgScore: {$avg: "$point"}}}
            ], callback);
        };
    }
}






