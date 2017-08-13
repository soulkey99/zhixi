/**
 * Created by MengLei on 2016-08-26.
 */
"use strict";
/**
 * 根据ID获取用户记录
 * @param id
 * @returns {*}
 */
exports.getUserById = function *(id) {
    return yield model.UserT.findById(id);
};

/**
 * 修改用户信息
 * @param param = {nick: '', name: '', intro: '', avatar: '', school: '', version: '', grade: ''}
 * @returns {*}
 */
exports.updateUserInfo = function *(param) {
    let setObj = {};
    if (param.nick != undefined) {
        setObj['nick'] = param.nick;
    }
    if (param.name != undefined) {
        setObj['name'] = param.name;
    }
    if (param.intro != undefined) {
        setObj['intro'] = param.intro;
    }
    if (param.avatar != undefined) {
        setObj['avatar'] = param.avatar;
    }
    return yield model.UserT.findByIdAndUpdate(param.userID, {$set: setObj}, {new: true});
};

/**
 * 根据手机号获取用户记录
 * @param phone
 * @returns {*}
 */
exports.getUserByPhone = function *(phone) {
    return yield model.UserT.findOne({phone: phone, delete: false});
};

exports.getMsg = function *(param) {
    //
};

exports.msgDetail = function *(msg_id) {
    //
};

/**
 * 创建用户
 * @param param = {phone: '', nick: '', avatar: '', intro: '', }
 * @returns {*}
 */
exports.createUser = function *(param) {
    let user = new (model.UserT)();
    if (param.userID) {
        user._id = param.userID;
    }
    if (param.phone) {
        user.phone = param.phone;
    }
    if (param.passwd) {
        user.passwd = param.passwd;
    }
    if (param.nick) {
        user.nick = param.nick;
    }
    if (param.avatar) {
        user.avatar = param.avatar;
    }
    if (param.type) {
        user.type = param.type;
    }
    return yield user.save();
};

/**
 * 教师端获取我的班级列表
 * @param param = {userID: '', valid: '', start: '', limit: ''}
 * @returns {*}
 */
exports.getMyClass = function *(param) {
    let query = {t_id: param.userID, valid: true};
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let res = yield model.Class.find(query).sort({createdAt: -1}).skip(start).limit(count);
    let list = [];
    for (let i = 0; i < res.length; i++) {
        let item = yield res[i].toListInfo();
        list.push(item);
    }
    // return res.map(item=>item.toObject({getters: true}));
    return list;
};

/**
 * 教师向班级添加学生，s_id多个用逗号分隔
 * @param param = {class_id: '', s_id: ''}
 * @returns {boolean}
 */
exports.addStudent = function *(param) {
    let s_ids = [];
    if (param.s_id) {
        s_ids = param.s_id.split(',');
    }
    for (let i = 0; i < s_ids.length; i++) {
        let cs = new (model.ClassStudent)();
        cs.school_id = param.school_id;
        cs.class_id = param.class_id;
        cs.s_id = s_ids[i];
        cs.type = 'add';    //教师主动加入的学生
        cs.status = 'verified';
        yield cs.save();
    }
    return true;
};

/**
 * 教师删除班级学生，s_id多个用逗号分隔
 * @param param = {class_id: '', s_id: ''}
 * @returns {boolean}
 */
exports.removeStudent = function *(param) {
    let s_ids = [];
    if (param.s_id) {
        s_ids = param.s_id.split(',');
    }
    for (let i = 0; i < s_ids.length; i++) {
        yield model.ClassStudent.update({
            class_id: param.class_id,
            s_id: s_ids[i]
        }, {$set: {valid: false}}, {multi: true});
    }
    return true;
};

/**
 * 教师获取班级申请历史列表
 * @param param = {userID: '', class_id: '', start: '', limit: '', status: ''}
 * @returns {Array}
 */
exports.classJoinList = function *(param) {
    let query = {type: 'apply', valid: true};
    if (param.class_id) {
        query['class_id'] = param.class_id;
    } else {
        let curDate = new Date();
        let cls = yield model.Class.find({
            t_id: param.userID,
            startAt: {$lte: curDate},
            endAt: {$gte: curDate}
        }, {_id: 1});
        let c_ids = [];
        for (let i = 0; i < cls.length; i++) {
            c_ids.push(cls[i]._id);
        }
        query['class_id'] = {$in: c_ids}
    }
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    if (param.status) {
        query['status'] = param.status;
    }
    let res = yield model.ClassStudent.find(query).sort({createdAt: -1}).skip(start).limit(count);
    let list = [];
    for (let i = 0; i < res.length; i++) {
        list.push(yield res[i].toClassStudentInfo());
    }
    return list;
};

/**
 * 教师审核学生加入班级的申请
 * @param param = {cs_id: '', status: '', reason: '拒绝原因'}
 * @returns {*}
 */
exports.checkClassJoin = function *(param) {
    let setObj = {status: param.status};
    if (param.reason) {
        setObj['reason'] = param.reason;
    }
    return yield model.ClassStudent.findByIdAndUpdate(param.cs_id, {$set: setObj}, {new: true});
};

/**
 * 获取教师端待办事项
 * @param param = {limit: '', userID: '', type: 'schedule/homework'}
 * @returns {Array}
 */
exports.todoList = function *(param) {
    let list = [];
    let limit = Number.parseInt(param.limit || '3');
    let query1 = {t_id: param.userID, endAt: {$gte: new Date()}};
    let query2 = {
        t_id: param.userID,
        endAt: {$lte: new Date(), $gte: new Date(Date.now() - 86400 * 7 * 1000)},   //结束7天内的课时
        homework_status: {$in: ['waiting', 'draft']},   //待布置作业，waiting和draft状态
        valid: true
    };
    let query3 = {t_id: param.userID, homework_endAt: {$lte: new Date()}, homework_checked: false, valid: true};
    let res = yield [
        model.ClassSchedule.find(query1).sort({startAt: 1}).limit(limit),   //待上课
        // model.ClassSchedule.find(query2).sort({startAt: 1}),    //待布置作业（只显示一周内结束的课）
        model.ClassSchedule.find(query3).sort({homework_endAt: 1})      //待批改作业
    ];
    res.splice(1, 0, null);//由于上面注释掉了第二个请求，这里塞进去一个元素占位
    for (let i = 0; i < res[0].length; i++) {
        let item = yield res[0][i].toClassInfo();
        item.type = 'schedule';
        let res1 = yield [
            model.ClassStudent.count({class_id: item.class_id, status: 'verified', valid: true}),
            model.StudentHomework.count({schedule_id: item.schedule_id, status: 'finished', type: 'schedule'})
        ];
        item.student_total = res1[0];
        item.student_finished = res1[1];
        item.status = item.endAt > Date.now() ? 'pending' : 'ongoing';
        list.push(item);
    }
    // for (let i = 0; i < res[1].length; i++) {
    //     let item = yield res[1][i].toClassInfo();
    //     item.type = 'homework';
    //     item.status = item.homework_status;
    //     delete(item.homework_status);
    //     list.push(item);
    // }
    for (let i = 0; i < res[2].length; i++) {
        let item = yield res[2][i].toClassInfo();
        let res1 = yield [
            model.ClassStudent.count({class_id: item.class_id, status: 'verified', valid: true}),
            model.StudentHomework.count({schedule_id: item.schedule_id, status: 'finished', type: 'schedule'})
        ];
        item.student_total = res1[0];
        item.student_finished = res1[1];
        item.type = 'homework';
        item.status = item.homework_status;
        delete(item.homework_status);
        list.push(item);
    }
    return list;
};

/**
 * 获取教师端课程表
 * @param param = {userID: '', limit: '', userID: '', type: 'schedule/homework', class_id: ''}
 * @returns {Array}
 */
exports.classTodo = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let query = {userID: param.userID};
    if (param.class_id) {
        query['class_id'] = param.class_id;
    }
};

/**
 * 教师留作业
 * @param param = {schedule_id: '', userID: '', endAt: '', homework_desc: '', q_id: '逗号分隔', status: 'draft/assigned', auto: 'true/false'}
 * @returns {*}
 */
exports.assignHomework = function *(param) {
    let schedule = yield model.ClassSchedule.findById(param.schedule_id);
    let setObj = {
        homework_status: param.status || 'draft'//默认是草稿，只有传了assigned才是发布
    };
    if (param.auto) {
        setObj['homework_auto'] = param.auto == 'true';     //是否下课自动发布作业
    }
    if (param.q_id) {
        setObj['questions'] = Array.from(new Set(param.q_id.split(',')));   //利用set结构进行去重操作
    } else {
        let q_ids = [];
        for (let i = 0; i < param.qlist.length; i++) {
            q_ids = q_ids.concat(param.qlist[i].question_ids);
        }
        setObj['questions'] = Array.from(new Set(q_ids));
    }
    if (param.endAt) {
        let t = new Date(param.endAt);
        t.setHours(23, 59, 59, 999);
        setObj['homework_endAt'] = t;
    }
    if (param.status == 'assigned') {
        setObj['homework_endAt'] = param.endAt || new Date(schedule.endAt + 86400 * 7 * 1000);  //提交截止时间，如果没有，就是下课一周后
    }
    schedule = yield model.ClassSchedule.findByIdAndUpdate(schedule._id, {$set: setObj}, {new: true});
    if (schedule.homework_status == 'assigned') {   //如果是直接发布
        yield schedule.publish();
    }
    return schedule;
};

/**
 * 执行发布指定课时的作业草稿
 * @param param = {schedule_id: ''}
 * @returns {*}
 */
exports.publishHomework = function *(param) {
    let schedule = yield model.ClssSchedule.findById(param.schedule_id);
    if (schedule.homework_status == 'draft') {
        yield schedule.publish();
    }
    return schedule;
};

/**
 * 给学生单独留补充作业
 * @param param = {schedule_id: '', s_id: '', endAt: '', q_id: '', qlist: []}
 * @returns {*}
 */
exports.additionHomework = function *(param) {
    let schedule = yield model.ClassSchedule.findById(param.schedule_id);
    let q_ids = [];
    if (param.q_id) {
        q_ids = Array.from(new Set(param.q_id.split(',')));   //利用set结构进行去重操作
    } else {
        for (let i = 0; i < param.qlist.length; i++) {
            q_ids = q_ids.concat(param.qlist[i].question_ids);
        }
        q_ids = Array.from(new Set(q_ids));
    }
    return yield model.StudentHomework.doPublish({
        class_id: schedule.class_id,
        schedule_id: schedule._id,
        type: 'additional',
        s_id: param.s_id,
        endAt: param.endAt,
        questions: q_ids.map(i => ({q_id: i}))
    });
};

/**
 * 获取指定课时的学生收到的作业列表
 * @param param = {schedule_id: '', s_id: '', start: '', limit: '', type: '', status: ''}
 * @returns {Array}
 */
exports.studentHomeworkList = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let query = {schedule_id: param.schedule_id};
    if (param.type) {
        query['type'] = param.type;
    }
    if (param.s_id) {
        query['s_id'] = param.s_id;
    }
    if (param.status) {
        query['status'] = {$in: param.status.split(',')};
    }
    let res = yield model.StudentHomework.find(query).sort({createdAt: 1}).skip(start).limit(count);
    let list = [];
    for (let i = 0; i < res.length; i++) {
        let item = yield res[i].toStudentInfo();
        list.push(item);
    }
    return list;
};

/**
 * 获取指定学生作业的指定题目答题流程
 * @param param = {swork_id: '', q_id: ''}
 * @returns {{swork_id: *, q_id: *, shortestPath: *, point: number, status: string, step: *[]}}
 */
exports.sworkQuestionSteps = function *(param) {
    let swork = yield model.StudentHomework.findById(param.swork_id);
    let q = yield model.StudyQuestion.findById(param.q_id);
    let info = {
        swork_id: param.swork_id,
        schedule_id: swork.schedule_id,
        type: swork.type,
        q_id: param.q_id,
        point: 0,
        status: 'finished',
        step: [{
            q_id: q.q_id,
            info: q.toItem(),
        }]
    };
    for (let i = 0; i < swork.questions.length; i++) {
        if (swork.questions[i].q_id.toString() == param.q_id) {
            info.status = swork.questions[i].status;
            info.point = swork.questions[i].point;
            for (let j = 0; j < swork.questions[i].step.length; j++) {
                if (info.step[info.step.length - 1] && info.step[info.step.length - 1].q_id.toString() == swork.questions[i].step[j].q_id.toString()) {
                    info.step[info.step.length - 1].choice_id.push(swork.questions[i].step[j].choice_id);
                } else {
                    let stepQ = yield model.StudyQuestion.findById(swork.questions[i].step[j].q_id);
                    info.step.push({
                        q_id: stepQ.q_id,
                        info: stepQ.toItem(),
                        choice_id: [swork.questions[i].step[j].choice_id],
                        t: swork.questions[i].step[j].t
                    });
                }
            }
            break;
        }
    }
    return info;
};

/**
 * 教师放弃留作业、重置作业
 * @param param = {schedule_id: '', status: ''}
 * @returns {*}
 */
exports.abandonHomework = function *(param) {
    return yield model.ClassSchedule.findByIdAndUpdate(param.schedule_id, {
        $set: {     //将状态置为放弃，并将其他作业相关所有字段重置
            homework_status: param.status || 'abandoned',
            questions: [],
            homework_endAt: '',
            homework_waiting_num: 0,
            homework_auto: false
        }
    }, {new: true});
};

/**
 * 教师留作业时从教材中抽取习题
 * @param param = {version: '', grade: ''}
 * @returns {Array}
 */
exports.homeworkQList = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let query = {};
    if (param.version) {
        query['version'] = param.version;
    }
    if (param.grade) {
        query['grade'] = param.grade;
    }
    query['subject'] = param.subject || '数学';
    let versions = yield model.StudyVersion.find(query);
    let ver_ids = versions.map(i => i._id);
    let chaps = yield model.StudyChapter.find({ver_id: {$in: ver_ids}});
    let sec_ids = [];
    chaps.forEach(i => {
        sec_ids = sec_ids.concat(i.sections);
    });
    let secs = yield model.StudySection.find({_id: {$in: sec_ids}});
    let q_ids = [];
    secs.forEach(i => {
        q_ids = q_ids.concat(i.questions);
    });
    let questions = [];
    if (param.getType == 'random') {
        questions = yield agg(model.StudyQuestion, [{
            $match: {
                _id: {$in: q_ids},
                status: 'verified',
                type: 'root'
            }
        }, {$sample: {size: count}}]);
        return questions.map(i => {
            i.q_id = i._id.toString();
            delete(i._id);
            return i;
        })
    } else {
        questions = yield model.StudyQuestion.find({
            _id: {$in: q_ids},
            status: 'verified',
            type: 'root'
        }).sort({createAt: 1}).skip(start).limit(count);
        return questions.map(i => i.toObject({getters: true}));
    }
};

/**
 * 教师获取自己相关的作业列表
 * @param param = {userID: '', start: '', limit: '', class_id: '', status: '', sort: 'asc/desc'}
 * @returns {Array}
 */
exports.myHomeworkList = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let query = {valid: true};
    if (param.class_id) {   //如果指定班级，那么就是这个班级的作业，否则就是这个教师所有的作业
        query['class_id'] = param.class_id;
    } else {
        query['t_id'] = param.userID;
    }
    if (param.status) {
        query['homework_status'] = {$in: param.status.split(',')};
    }
    //作业开始时间就是这节课的下课时间
    let res = yield model.ClassSchedule.find(query).sort({endAt: param.sort == 'asc' ? 1 : -1}).skip(start).limit(count);
    let list = [];
    for (let i = 0; i < res.length; i++) {
        let item = yield res[i].toClassInfo();
        list.push(item);
    }
    return list;
};

/**
 * 获取指定课时的作业统计数据
 * @param schedule_id
 */
exports.scheduleHomeworkStat = function *(schedule_id) {
    let schedule = yield model.ClassSchedule.findById(schedule_id);
    if (!schedule.homework_checked && schedule.homework_endAt < new Date()) {
        yield model.ClassSchedule.findByIdAndUpdate(schedule, {$set: {homework_checked: true}});
    }
    if (!schedule.homework_stat_id) {   //如果未生成数据，那么计算实时结果，只是部分数据
        let c = yield model.Class.findById(schedule.class_id);
        let sworks = yield model.StudentHomework.find({schedule_id, type: 'schedule'});
        let info = {
            homework_stat_id: '',
            class_id: schedule.class_id,
            class_name: c.name,
            avatar: c.avatar,
            schedule_id: schedule_id,
            seq: schedule.seq,
            student_total: sworks.length,
            student_finished: 0,
            unfinished_students: [],
            status: 'pending'
        };
        for (let i = 0; i < sworks.length; i++) {
            if (sworks[i].status == 'finished' || sworks[i].status == 'submitted') {
                info.student_finished++;
            } else {
                let stu = yield model.UserS.findById(sworks[i].s_id);
                info.unfinished_students.push(stu.toSimpleSInfo());
            }
        }
        return info;
    }
    let stat = yield model.HomeworkStat.findById(schedule.homework_stat_id);
    return yield stat.toInfo();
};

/**
 * 指定课时作业未完成学生的信息
 * @param param = {schedule_id: '', start: '', limit: ''}
 * @returns {Array}
 */
exports.unfinishedHomeworkStudentList = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let list = [];
    let res = yield model.StudentHomework.find({
        schedule_id: param.schedule_id,
        type: 'schedule',
        status: {$in: ['timeout', 'timeoutFinished', 'pending']}   //未完成以及未完成后补交的
    }).skip(start).limit(count);
    for (let i = 0; i < res.length; i++) {
        let item = yield res[i].toStudentInfo();
        list.push(item);
    }
    return list;
};

/**
 * 返回指定课时作业统计信息的学生答题情况列表
 * @param param = {schedule_id: ''}
 * @returns {*}
 */
exports.homeworkStatStudentList = function *(param) {
    // let start = 0;
    // let count = Number.parseInt(param.limit || '10');
    // if (param.start) {
    //     start = Number.parseInt(param.start) - 1;
    // } else if (param.page) {
    //     start = (Number.parseInt(param.page || '1') - 1) * count;
    // }
    let schedule = yield proxy.School.getScheduleByID(param.schedule_id);
    if (!schedule.homework_stat_id) {
        yield schedule.calculate();
    }
    let stat = yield model.HomeworkStat.findById(schedule.homework_stat_id);
    return yield stat.toStudentList();
};

/**
 * 返回指定课时作业的学生答题详情
 * @param param = {userID: '', s_id: '', schedule_id: '', swork_id: '', type: ''}
 * @returns {{s_id: *, s_nick: *, s_name: *, s_avatar: *, list: Array}}
 */
exports.homeworkStatStudentDetail = function *(param) {
    let point_threshold = 100;   //题目正确与错误的分界值
    let query = {  //如果以schedule_id和s_id获取，那么只能是课时作业
        schedule_id: param.schedule_id,
        s_id: param.s_id
    };
    if (param.type) {
        query['type'] = param.type;
    }
    if (param.swork_id) { //如果传了swork_id，那么就只获取该记录
        query = {_id: param.swork_id};
    }
    let sworks = yield model.StudentHomework.find(query);
    let stu = yield model.UserS.findById(param.swork_id ? sworks[0].s_id : param.s_id);
    let info = {
        swork_id: '',
        schedule_id: '',
        type: '',
        status: '',
        s_id: stu.userID,
        s_nick: stu.nick,
        s_name: stu.name,
        s_avatar: stu.avatar,
        question_total: 0,
        wrong_count: 0,
        correct_count: 0,
        has_feedback: false,
        list: []
    };
    let feedbacks = yield model.HomeworkFeedback.find({
        t_id: param.userID,
        s_id: sworks[0].s_id,
        schedule_id: sworks[0].schedule_id
    }).limit(1);
    info.has_feedback = !!feedbacks.length;
    for (let k = 0; k < sworks.length; k++) {
        let swork = sworks[k];
        info.question_total += swork.questions.length;
        for (let i = 0; i < swork.questions.length; i++) {
            let q = yield model.StudyQuestion.findById(swork.questions[i].q_id);
            let item = {
                q_id: swork.questions[i].q_id,
                swork_id: swork.swork_id,
                type: swork.type,
                status: swork.questions[i].status,
                point: swork.questions[i].point,
                info: q.toItem()
            };
            info.list.push(item);
            if (item.point < point_threshold && item.status == 'finished') {
                info.wrong_count++;
            }
            if (item.point == point_threshold && item.status == 'finished') {
                info.correct_count++;
            }
        }
    }
    if (sworks.length == 1) {
        info.swork_id = sworks[0].swork_id;
        info.type = sworks[0].type;
        info.schedule_id = sworks[0].schedule_id;
        info.status = sworks[0].status;
    } else {
        info.schedule_id = param.schedule_id || sworks[0].schedule_id;
        if (param.type) {
            info.type = param.type;
        }
    }
    return info;
};

/**
 * 返回指定课时作业统计信息的错题情况列表
 * @param param = {schedule_id: ''}
 * @return {*}
 */
exports.homeworkStatWrongQuestion = function *(param) {
    // let start = 0;
    // let count = Number.parseInt(param.limit || '10');
    // if (param.start) {
    //     start = Number.parseInt(param.start) - 1;
    // } else if (param.page) {
    //     start = (Number.parseInt(param.page || '1') - 1) * count;
    // }
    let schedule = yield proxy.School.getScheduleByID(param.schedule_id);
    let stat = yield model.HomeworkStat.findById(schedule.homework_stat_id);
    return yield stat.toWrongQuestionList();
};


/**
 * 返回指定课时作业统计信息的指定题目答错学生列表
 * @param param = {schedule_id: '', q_id: ''}
 * @returns {*}
 */
exports.homeworkStatQuestionWrongStudent = function *(param) {
    let q = yield model.StudyQuestion.findById(param.q_id);
    let sworks = yield model.StudentHomework.find({ //只有完成状态的课时作业，才计入
        schedule_id: param.schedule_id,
        type: 'schedule'
    });
    let info = q.toItem();
    let list = [];
    for (let i = 0; i < sworks.length; i++) {
        for (let j = 0; j < sworks[i].questions.length; j++) {
            if (sworks[i].questions[j].q_id.toString() == param.q_id && sworks[i].questions[j].status == 'finished' && sworks[i].questions[j].point < 100) {
                let stu = yield model.UserS.findById(sworks[i].s_id);
                let item = stu.toSimpleSInfo();
                item.point = sworks[i].questions[j].point;
                item.swork_id = sworks[i].swork_id;
                item.type = sworks[i].type;
                list.push(item);
                break;
            }
        }
    }
    info.list = list;
    return info;
};

/**
 * 获取指定课时指定学生的作业反馈列表
 * @param param = {userID: '', schedule_id: '', s_id: '', start: '', limit: ''}
 * @returns {Array}
 */
exports.homeworkFeedback = function *(param) {
    let query = {
        t_id: param.userID,
        schedule_id: param.schedule_id,
        s_id: param.s_id
    };
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let res = yield model.HomeworkFeedback.find(query).sort({createdAt: -1}).skip(start).limit(count);
    let list = [];
    for (let i = 0; i < res.length; i++) {
        let item = yield res[i].toInfo();
        list.push(item);
    }
    return list;
};

/**
 * 对指定学生指定课时的作业添加反馈
 * @param param = {userID: '', schedule_id: '', s_id: '', content: ''}
 * @returns {*}
 */
exports.addHomeworkFeedback = function *(param) {
    let schdule = yield model.ClassSchedule.findById(param.schedule_id);
    let feedback = new (model.HomeworkFeedback)();
    feedback.class_id = schdule.class_id;
    feedback.schedule_id = param.schedule_id;
    feedback.s_id = param.s_id;
    feedback.t_id = param.userID;
    feedback.content = param.content;
    return yield feedback.save();
};

/**
 * 获取反馈列表
 * @param param = {userID: '', type: '', start: '', limit: ''}
 * @returns {Array}
 */
exports.feedbackTemplate = function *(param) {
    let query = {$or: [{userID: param.userID, type: 'personal'}, {type: 'public'}]};
    switch (param.type) {
        case 'personal':
            query = {userID: param.userID, type: 'personal'};
            break;
        case 'public':
            query = {type: 'public'};
            break;
        default:
            break;
    }
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let res = yield model.HomeworkFeedbackTemplate.find(query).sort({
        level: -1,
        createdAt: -1
    }).skip(start).limit(count);
    let list = [];
    for (let i = 0; i < res.length; i++) {
        let item = yield res[i].toItem();
        list.push(item);
    }
    return list;
};

/**
 * thunkify的aggregate函数
 * @param model
 * @param pipeline
 * @param callback
 * @returns {Function}
 */
function agg(model, pipeline, callback) {
    return function (callback) {
        model.aggregate(pipeline, callback);
    }
}



