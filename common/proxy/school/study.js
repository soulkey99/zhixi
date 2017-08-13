/**
 * Created by MengLei on 2016-09-23.
 */
"use strict";
/**
 * 获取教材的目录(根据年级学科教材版本或者根据ver_id)
 * @param param = {ver_id: '', version: '', grade: '', subject: ''}
 * @returns {Array}
 */
exports.getCatalog = function *(param) {
    let query = {};
    if (param.ver_id) {
        query = {_id: param.ver_id};
    } else {
        if (param.stage) {
            query['stage'] = param.stage;
        }
        if (param.grade) {
            query['grade'] = param.grade;
        }
        if (param.subject) {
            query['subject'] = param.subject;
        }
        if (param.version) {
            query['version'] = param.version;
        }
    }
    let version = yield model.StudyVersion.findOne(query);
    let list = [];
    if (!version) {
        return list;
    }
    let chapters = yield model.StudyChapter.find({ver_id: version._id});
    for (let i = 0; i < chapters.length; i++) {
        let item = {
            cha_id: chapters[i].cha_id,
            title: chapters[i].title,
            remark: chapters[i].remark,
            seq: chapters[i].seq,
            sections: []
        };
        let sections = yield model.StudySection.find({_id: {$in: chapters[i].sections}, type: 'section'});
        for (let j = 0; j < sections.length; j++) {
            item.sections.push({
                sec_id: sections[j].sec_id,
                title: sections[j].title,
                remark: sections[j].remark,
                seq: sections[j].seq
            });
            item.sections.sort((a, b) => a.seq - b.seq);
        }
        list.push(item);
    }
    list.sort((a, b) => a.seq - b.seq);
    return list;
};

/**
 * 根据ver_id获取version记录
 * @param ver_id
 * @returns {*}
 */
exports.getVersionByID = function *(ver_id) {
    return yield model.StudyVersion.findById(ver_id);
};

/**
 * 根据给定条件获取教材记录
 * @param param = {stage: '', grade: '', subject: '', version: ''}
 * @returns {*}
 */
exports.getOneVersion = function *(param) {
    let query = {};
    if (param.version) {
        query['version'] = param.version;
    }
    if (param.stage) {
        query['stage'] = param.stage;
    }
    if (param.grade) {
        query['grade'] = param.grade;
    }
    if (param.subject) {
        query['subject'] = param.subject;
    }
    return yield model.StudyVersion.findOne(query);
};

/**
 * 获取指定小节下的问题列表
 * @param param = {sec_id: '', start: '', limit: '', userID: ''}
 * @returns {*}
 */
exports.sectionQuestion = function*(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let sec = yield model.StudySection.findById(param.sec_id, {questions: {$slice: [start, count]}});
    let quesions = yield model.StudyQuestion.find({_id: {$in: sec.questions.toObject()}});
    let finished_q_ids = yield model.StudyExercise.distinct('q_id', {
        q_id: {$in: sec.questions},
        sec_id: sec.sec_id,
        type: 'exercise',
        userID: param.userID,
        status: 'finished'
    });
    let finished_ids = finished_q_ids.join(',');
    let list = [];
    // quesions.map(i => {
    //     let item = i.toItem();
    //     item.finished = finished_ids.indexOf(i.q_id) >= 0;
    //     return item;
    // });
    for (let i = 0; i < sec.questions.length; i++) {
        for (let j = 0; j < quesions.length; j++) {
            if (sec.questions[i].toString() == quesions[j].q_id.toString()) {
                let item = quesions[j].toItem();
                item.finished = finished_ids.indexOf(item.q_id) >= 0;
                list.push(item);
            }
        }
    }
    return list;
};

/**
 * 根据问题ID获取问题记录
 * @param q_id
 * @returns {*}
 */
exports.getQuestionByID = function*(q_id) {
    return yield model.StudyQuestion.findById(q_id);
};

/**
 * 根据一串ID数组获取题目列表
 * @param ids
 * @returns {*}
 */
exports.getQuestionsByIDs = function *(ids) {
    let questions = yield model.StudyQuestion.find({_id: {$in: ids}});
    return questions.map(i => i.toItem());
    // return questions.map(i=> {
    //     let item = i.toObject({getters: true});
    //     // delete(item._id);  //删掉没用的字段
    //     // delete(item.id);
    //     // delete(item.msg);
    //     // delete(item.status);
    //     // delete(item.userID);
    //     // delete(item.createAt);
    //     // delete(item.updateAt);
    //     // delete(item.__v);
    //     return item;
    // });
};

/**
 * 获取指定用户指定问题的练习历史
 * @param param = {userID: '', q_id: ''}
 * @return {Array}
 */
exports.questionExercise = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let query = {
        userID: param.userID,
        q_id: param.q_id,
        status: 'finished',
        type: 'exercise'
    };
    let e = yield model.StudyExercise.find(query).sort({createdAt: -1}).skip(start).limit(count);
    return e.map(i => ({
        e_id: i.e_id,
        createdAt: i.createdAt,
        point: i.point,
        q_id: i.q_id,
        sec_id: i.sec_id,
        type: i.type,
        status: i.status
    }));
};

/**
 * 根据年级、学科、版本获取教材列表
 * @param param = {stage: '', version: '', grade: '', subject: '', type: '', title: '', start: '', limit: ''}
 * @returns {*}
 */
exports.exerciseVersionList = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let query = {$and: [{cover: {$ne: ''}}, {cover: {$ne: null}}]};
    if (param.stage) {
        query['stage'] = param.stage;
    }
    if (param.version) {
        query['version'] = param.version;
    }
    if (param.grade) {
        query['grade'] = param.grade;
    }
    if (param.subject) {
        query['subject'] = param.subject;
    }
    if (param.type) {
        query['type'] = param.type;
    }
    if (param.title) {
        query['title'] = {$regex: param.title};
    }
    let res = yield model.StudyVersion.find(query).sort({createdAt: -1}).skip(start).limit(count);
    return res.map(i => i.toDetail());
};

/**
 * 获取指定教材、练习册的练习进度，根据ver_id或者(学段年级学科版本)确定教材，后者可能不准确
 * @param param = {userID: '', ver_id: '', stage: '', grade: '', subject: '', version: ''}
 * @returns {{total: number, finish: number, catalog: Array}}
 */
exports.versionProcess = function *(param) {
    let query = {};
    if (param.ver_id) {
        query = {_id: param.ver_id};
    } else {
        if (param.stage) {
            query['stage'] = param.stage;
        }
        if (param.grade) {
            query['grade'] = param.grade;
        }
        if (param.subject) {
            query['subject'] = param.subject;
        }
        if (param.version) {
            query['version'] = param.version;
        }
    }
    let version = yield model.StudyVersion.findOne(query);
    let info = {total: 0, finish: 0, catalog: [], last_sec_id: '', last_time: ''};
    if (!version) {
        return info;
    }
    let chapters = yield model.StudyChapter.find({ver_id: version._id});
    for (let i = 0; i < chapters.length; i++) {
        let item = {
            cha_id: chapters[i].cha_id,
            total: 0,
            finish: 0,
            seq: chapters[i].seq,
            sections: []
        };
        let sections = yield model.StudySection.find({_id: {$in: chapters[i].sections}, type: 'section'});
        for (let j = 0; j < sections.length; j++) {
            let sec_item = {
                sec_id: sections[j].sec_id,
                total: sections[j].questions.length,
                finish: 0,
                seq: sections[j].seq
            };
            let finished_q_ids = yield model.StudyExercise.distinct('q_id', {
                q_id: {$in: sections[j].questions},
                sec_id: sections[j].sec_id,
                type: 'exercise',
                userID: param.userID,
                status: 'finished'
            });
            sec_item.finish = finished_q_ids.length;
            item.sections.push(sec_item);
            let last = yield model.StudyExercise.findOne({
                userID: param.userID,
                sec_id: sections[j].sec_id,
                type: 'exercise',
                status: 'finished'
            }).sort({createdAt: -1});
            if (last && last.updatedAt > info.last_time) {
                info.last_sec_id = last.sec_id;
                info.last_time = last.updatedAt;
            }
            item.sections.sort((a, b) => a.seq - b.seq);
        }
        item.sections.forEach(i => {
            item.total += i.total;
            item.finish += i.finish;
        });
        info.catalog.push(item);
    }
    info.catalog.sort((a, b) => a.seq - b.seq);
    info.catalog.forEach(i => {
        info.total += i.total;
        info.finish += i.finish;
    });
    return info;
};

/**
 * 新建立一个练习
 * @param param = {userID: '', type: '', sec_id: '', q_id: ''}
 * @returns {*}
 */
exports.genExercise = function *(param) {
    yield model.StudyExercise.update({  //先把之前没做完的所有练习状态都设置成取消
        userID: param.userID,
        type: param.type,
        status: 'pending'
    }, {$set: {status: 'canceled'}}, {multi: true});
    let e = new (model.StudyExercise)();
    e.userID = param.userID;
    if (param.type) {
        e.type = param.type;
    }
    e.sec_id = param.sec_id;
    e.q_id = param.q_id;
    e.step.push({q_id: param.q_id, type: 'root'});
    //这里添加最近列表
    yield model.StudentRecent.addRecent({userID: param.userID, q_id: param.q_id, sec_id: param.sec_id});
    return yield e.save();
};

/**
 * 获取指定节下一道没有答过的题目
 * @param param = {sec_id: '', userID: '', q_id: ''}
 * @returns {*}
 */
exports.sectionNext = function *(param) {
    let section = yield model.StudySection.findById(param.sec_id);
    let q_list = [];
    for (let i = 0; i < section.questions.length; i++) {
        if (section.questions[i].toString() == param.q_id) {
            q_list = [];
        } else {
            q_list.push(section.questions[i]);
        }
    }
    for (let i = 0; i < q_list.length; i++) {
        let e = yield model.StudyExercise.findOne({
            userID: param.userID,
            sec_id: section.sec_id,
            q_id: q_list[i],
            status: 'finished'
        });
        if (!e) {
            let q = yield model.StudyQuestion.findById(q_list[i]);
            return yield q.toItem();
        }
    }
    return {};
};

/**
 * 获取指定小节的下一节ID
 * @param param = {userID: '', sec_id: ''}
 * @returns {{ver_id: *, ver_title: *, type: *, grade: *, subject: *, version: *, cha_id: string, cha_title: string, sec_id: string, sec_title: string}}
 */
exports.nextSection = function *(param) {
    let chapter = yield model.StudyChapter.findOne({sections: param.sec_id});
    let version = yield model.StudyVersion.findById(chapter.ver_id);
    let info = {
        ver_id: chapter.ver_id,
        ver_title: version.title,
        type: version.type,
        grade: version.grade,
        subject: version.subject,
        version: version.version,
        cha_id: '',
        cha_title: '',
        sec_id: '',
        sec_title: ''
    };
    let section = yield model.StudySection.findById(param.sec_id);
    let nextSection = yield model.StudySection.findOne({_id: {$in: chapter.sections}, seq: {$gt: section.seq}});
    if (nextSection) {
        info.cha_id = chapter.cha_id;
        info.cha_title = chapter.title;
        info.sec_id = nextSection.sec_id;
    } else {
        let nextChapter = yield model.StudyChapter.findOne({
            ver_id: chapter.ver_id,
            seq: {$gt: chapter.seq}
        }).sort({seq: 1});
        if (nextChapter && nextChapter.sections[0]) {
            info.cha_id = nextChapter.cha_id;
            info.cha_title = nextChapter.title;
            info.sec_id = nextChapter.sections[0];
        }
    }
    if (info.sec_id) {
        let section = yield model.StudySection.findById(info.sec_id);
        info.sec_title = section.title;
    }
    return info;
};
exports.nextSectionQuestion = function *(param) {
    let chapter = yield model.StudyChapter.findOne({sections: param.sec_id});
    let version = yield model.StudyVersion.findById(chapter.ver_id);
    let info = {
        ver_id: chapter.ver_id,
        ver_title: version.title,
        type: version.type,
        grade: version.grade,
        subject: version.subject,
        version: version.version,
        cha_id: '',
        cha_title: '',
        sec_id: '',
        sec_title: ''
    };
    return yield getNextSection(param.sec_id);

    function *getNextSection(sec_id) {
        let section = yield model.StudySection.findById(sec_id);
        let nextChapter = chapter;
        let nextSection = yield model.StudySection.findOne({_id: {$in: chapter.sections}, seq: {$gt: section.seq}});
        if (!nextSection) {
            nextChapter = yield model.StudyChapter.findOne({
                ver_id: chapter.ver_id,
                seq: {$gt: chapter.seq}
            }).sort({seq: 1});
            if (nextChapter && nextChapter.sections.length > 0) {
                nextSection = yield model.StudySection.findOne({_id: {$in: nextChapter.sections[0]}}).sort({seq: 1});
            } else {
                return null;
            }
        }
        let all_finished = true;
        for (let i = 0; i < nextSection.questions.length; i++) {
            let e = yield model.StudyExercise.findOne({
                userID: param.userID,
                sec_id: sec_id,
                q_id: nextSection.questions[i],
                status: 'finished'
            });
            if (!e) {
                all_finished = false;
            }
        }
        if (all_finished) {
            return yield getNextSection(nextSection.sec_id);
        } else {
            info.cha_id = nextChapter.cha_id;
            info.cha_title = nextChapter.title;
            info.sec_id = nextSection.sec_id;
            info.sec_title = nextSection.title;
            return info;
        }
    }
};


/**
 * 练习答题
 * @param param = {userID: '', e_id: '', q_id: '', choice_id: ''}
 * @returns {*}
 */
exports.checkQuestion = function *(param) {
    let q = yield model.StudyQuestion.findById(param.q_id);    //question --> res[1]
    let setObj = {
        $push: {
            step: {
                q_id: param.q_id,
                choice_id: param.choice_id,
                type: q.type
            }
        }
    };
    if (q.choice.id(param.choice_id).action == 'result') {
        setObj['$set'] = {status: 'finished'};
    }
    let e = yield model.StudyExercise.findByIdAndUpdate(param.e_id, setObj, {new: true});
    if (q.choice.id(param.choice_id).action == 'result') {
        let sPath = yield q.toShortestPath();
        let point = (sPath.length / e.step.length) * 100;
        yield model.StudyExercise.findByIdAndUpdate(e._id, {$set: {point: (point > 100 ? 100 : point).toFixed(0)}}, {new: true});
        yield model.WrongQuestion.addWrongQuestion({    //添加最近错题列表
            userID: param.userID,
            type: 'exercise',
            q_id: param.q_id,
            e_id: param.e_id,
            sec_id: e.sec_id,
            point: (point > 100 ? 100 : point).toFixed(0)
        });
    }
    return e;
};

/**
 * 根据e_id获取练习回顾（题干以及所有错题的remark）
 * @param e_id
 * @returns {{root: string, list: Array}}
 */
exports.getReview = function *(e_id) {
    let e = yield model.StudyExercise.findById(e_id);
    let review = {root: '', list: []};
    let choice_ids = [];
    e.step.forEach(item => {
        if (item.type != 'root') {
            choice_ids.push(item.choice_id);
        }
    });
    let res = yield[
        model.StudyQuestion.findById(e.q_id),
        model.StudyQuestion.find({choice_id: {$in: choice_ids}, 'choice.correct': false})
    ];
    if (res[0] && res[0].remark) {
        review.root = res[0].remark;
    }
    res[1].forEach(item => {
        if (item && item.remark) {
            review.list.push(item.remark);
        }
    });
    return review;
};

/**
 * 获取练习的做题步骤
 * @param param = {userID: '', e_id: ''}
 * @returns {{q_id: *, sec_id: *, status: string, point: *, shortestPath: number, step: *[]}}
 */
exports.exerciseSteps = function *(param) {
    let e = yield model.StudyExercise.findById(param.e_id);
    let q = yield model.StudyQuestion.findById(e.q_id);
    let info = {
        q_id: e.q_id,
        sec_id: e.sec_id,
        status: e.status,
        point: e.point,
        shortestPath: 0,
        step: [q.toItem()]
    };
    if (q.shortestPath.length > 0) {
        info.shortestPath = q.shortestPath.length;
    } else {
        let sPath = yield q.toShortestPath();
        info.shortestPath = sPath.length;
    }
    for (let i = 0; i < e.step.length; i++) {
        if (e.step[i].type == 'root') {
            continue;
        }
        let q = yield model.StudyQuestion.findById(e.step[i].q_id);
        let stepItem = q.toItem();
        stepItem.choice_id = e.step[i].choice_id;
        stepItem.t = e.step[i].t;
        info.step.push(stepItem);
    }
    return info;
};

/**
 * 根据q_id获取题目的最短路径
 * @param q_id
 * @returns {Array}
 */
exports.shortestPath = function *(q_id) {
    let path = yield model.StudyQuestion.shortestPath(q_id);
    let list = [];
    for (let i = 0; i < path.length; i++) {
        let q = yield model.StudyQuestion.findById(path[i]);
        list.push(q.toItem());
    }
    return list;
};

exports.testFullQuestion = function *(q_id) {
    q_id = q_id || '57c111be86bd1c8379153237';
    let list = [];
    let start = q_id;
    let end = '';
    let q = yield model.StudyQuestion.findById(q_id);
    let data = {};
    if (!data[q_id]) {
        data[q.q_id] = new Set();
    }
    if (!data[q.next.toString()]) {
        data[q.next.toString()] = new Set();
    }
    data[q.q_id].add(q.next.toString());
    data[q.next.toString()].add(q.q_id);
    yield next_node(q.next);
    function* next_node(id) {
        let q = yield model.StudyQuestion.findById(id);
        if (!data[q.q_id]) {
            data[q.q_id] = new Set();
        }
        for (let i = 0; i < q.choice.length; i++) {
            if (q.choice[i].action == 'result') {
                end = q.q_id;
            }
            console.log(`q_id: ${q.q_id}, action: ${q.choice[i].action}, next_id: ${q.choice[i].next}`);
            if (q.choice[i].next) {
                data[q.q_id].add(q.choice[i].next.toString());
                if (!data[q.choice[i].next.toString()]) {
                    data[q.choice[i].next.toString()] = new Set();
                }
                data[q.choice[i].next.toString()].add(q.q_id);
                yield next_node(q.choice[i].next);
            }
        }
    }

    console.log(`start: ${start}, end: ${end}`);
    console.log(data);
};
