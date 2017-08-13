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
    return yield model.UserS.findById(id);
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
    if (param.passwd != undefined) {
        setObj['passwd'] = param.passwd;
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
    if (param.city != undefined) {
        setObj['userInfo.city'] = param.city;
    }
    if (param.school != undefined) {
        setObj['userInfo.school'] = param.school;
    }
    if (param.stage != undefined) {
        setObj['userInfo.stage'] = param.stage;
    }
    if (param.version != undefined) {
        setObj['userInfo.version'] = param.version;
    }
    if (param.grade != undefined) {
        setObj['userInfo.grade'] = param.grade;
    }
    if (param.target != undefined) {
        setObj['userInfo.target'] = param.target;
    }
    return yield model.UserS.findByIdAndUpdate(param.userID, {$set: setObj}, {new: true});
};

/**
 * 根据手机号获取用户记录
 * @param phone
 * @returns {*}
 */
exports.getUserByPhone = function *(phone) {
    return yield model.UserS.findOne({phone: phone, delete: false});
};

/**
 * 创建用户
 * @param param = {phone: '', nick: '', avatar: '', intro: '', }
 * @returns {*}
 */
exports.createUser = function *(param) {
    let user = new (model.UserS)();
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
 * 根据userID获取绑定的sso记录列表或者指定的某一条记录
 * @param param = {userID: '', type: ''}
 * @returns {*}
 */
exports.getUserSSO = function *(param) {
    let query = {userID: param.userID, valid: true};
    if (param.type) {
        query['type'] = param.type;
        return yield model.UserSSSO.findOne(query);
    } else {
        return yield model.UserSSSO.find(query);
    }
};

/**
 * 根据openid或者unionid获取sso记录信息
 * @param param = {openid: '', ssoType: '', unionid: ''}
 * @returns {*}
 */
exports.getSSOByOpenID = function *(param) {
    let query = {valid: true};
    let res = null;
    if (param.unionid) {
        query['unionid'] = param.unionid;
        query['type'] = param.ssoType;
        res = yield model.UserSSSO.findOne(query);
    }
    if (!res) {
        query['openid'] = param.openid;
        query['type'] = param.ssoType;
        res = yield model.UserSSSO.findOne(query);
        if (res && param.unionid) {
            res.unionid = param.unionid;
            yield res.save();
        }
    }
    return res;
};

/**
 * 创建一条sso记录
 * @param param = {userID: '', ssoType: '', openid: '', avatar: '', nick: '', access_token: '', expire: '', unionid: ''}
 * @returns {*}
 */
exports.createSSO = function *(param) {
    let sso = new (model.UserSSSO)();
    sso.userID = param.userID;
    sso.type = param.ssoType;
    sso.nick = param.nick || '';
    sso.avatar = param.avatar || '';
    sso.openid = param.openid;
    sso.unionid = param.unionid;
    sso.access_token = param.access_token;
    sso.refresh_token = param.refresh_token;
    sso.expire_at = new Date(Date.now() + 7200000);
    sso.refresh_at = new Date();
    return yield sso.save();
};

/**
 * 学生获取我加入的班级列表
 * @param param = {userID: '', start: '', limit: '', status: ''}
 * @returns {*}
 */
exports.getMyClass = function *(param) {
    let query = {s_id: param.userID, valid: true};
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    if (param.status) {
        query['status'] = param.status;
    } else {
        query['status'] = 'verified';
    }
    let res = yield model.ClassStudent.find(query).sort({createdAt: -1}).skip(start).limit(count);
    let list = [];
    for (let i = 0; i < res.length; i++) {
        let item = yield res[i].toStudentInfo();
        list.push(item);
    }
    return list;
};

/**
 * 搜索班级
 * @param param ={class_num: '', userID: ''}
 * @returns {Array}
 */
exports.searchClass = function *(param) {
    let query = {};
    if (param.class_num) {
        query['class_num'] = param.class_num;
    }
    let res = yield model.Class.find(query);
    let list = [];
    for (let i = 0; i < res.length; i++) {
        list.push(yield res[i].toStudentInfo(param.userID));
    }
    return list;
};

/**
 * 学生申请加入班级
 * @param param = {userID: '', class_id: '', msg: '留言'}
 * @returns {*}
 */
exports.joinClass = function *(param) {
    let query = {s_id: param.userID, class_id: param.class_id};
    let sc = yield model.ClassStudent.findOne(query);
    if (sc) {
        if (sc.valid && sc.status == 'verified') {  //如果本来就是已经加入过了，那么直接返回
            return sc;
        }
        let setObj = {status: 'pending', valid: true};
        if (param.msg) {
            setObj['msg'] = param.msg;
        }
        return yield model.ClassStudent.findByIdAndUpdate(sc._id, {$set: setObj});
    }
    let c = yield model.Class.findById(param.class_id);
    if (!c) {
        return null;
    }
    sc = new (model.ClassStudent)();
    sc.school_id = c.school_id;
    sc.s_id = param.userID;
    sc.class_id = param.class_id;
    if (param.msg) {
        sc.msg = param.msg;
    }
    return yield sc.save();
};

/**
 * 学生获取自己加入班级的历史以及审批状态
 * @param param = {userID: '', start: '', limit: ''}
 * @returns {Array}
 */
exports.joinClassHistory = function *(param) {
    let query = {s_id: param.userID, valid: true, type: 'apply'};
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
        list.push(yield res[i].toClassInfo());
    }
    return list;
};

/**
 * 通过手机号、昵称、姓名搜索学生
 * @param param = {phone: '', nick: '', name: '', start: '', limit: ''}
 * @returns {*}
 */
exports.search = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let query = {};
    if (param.phone) {
        query = {phone: {$regex: param.phone}};
    } else if (param.name) {
        query = {name: {$regex: param.name}};
    } else if (param.nick) {
        query = {nick: {$regex: param.nick}};
    } else {
        return [];
    }
    let res = yield model.UserS.find(query).skip(start).limit(count);
    return res.map(i => {
        return {s_id: i.userID, name: i.name, nick: i.nick, avatar: i.avatar, phone: i.phone}
    });
};

/**
 * 获取收件箱消息列表
 * @param param = {userID: '', read: '', type: '', start: '', limit: ''}
 * @returns {Array}
 */
exports.getMsg = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    if (start == 0) {//每次获取收件箱并且分页为第一页的情况下，先检查是否有最新的广播消息需要添加给该用户
        let npmsg = yield model.MsgS.findOne({to: param.userID, type: 'broadcast'}).sort({createdAt: -1}); //第一条广播消息的时间
        let query = {to: {$in: ['student', 'all']}};
        if (npmsg) {
            query['createdAt'] = {$gt: npmsg.createdAt};
        }
        let pmsg = yield model.Msg.find(query);
        for (let i = 0; i < pmsg.length; i++) {
            let nmsg = new (model.MsgS)();
            nmsg._id = pmsg[i]._id;
            nmsg.type = 'broadcast';
            nmsg.to = param.userID;
            nmsg.content = pmsg[i].content;
            nmsg.param = pmsg[i].param;
            nmsg.createdAt = pmsg[i].createdAt;
            nmsg.updateAt = pmsg[i].updatedAt;
            yield nmsg.save();
        }
    }
    let query = {to: param.userID};
    if (param.read != undefined) {
        query['read'] = param.read == 'true';
    }
    if (param.type) {
        query['type'] = param.type;
    }
    let res = yield model.MsgS.find(query).sort({createdAt: -1}).skip(start).limit(count);
    let list = [];
    for (let i = 0; i < res.length; i++) {
        list.push(yield res[i].toItem());
    }
    return list;
};

exports.msgDetail = function *(msg_id) {
    //
};

/**
 * 学生端获取自己的作业列表
 * @param param = {userID: '', start: '', limit: '', class_id: '', sort: '', status: '', history: 'true/false'}
 * @returns {Array}
 */
exports.homeworkList = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let query = {s_id: param.userID};
    if (param.getType == 'history') {
        query['endAt'] = {$lt: new Date()};
    } else {
        // query['endAt'] = {$gte: new Date()};
        query['$or'] = [{
            /*endAt: {$gte: new Date()}, */   //只获取pending状态的，不管时间（补充作业不会超时，课时作业会超时）
            status: 'pending'
        }, {
            endAt: {$lte: new Date()},
            status: 'timeout'
        }];
    }
    if (param.status) {
        query['status'] = {$in: param.status.split(',')};
    }
    if (param.class_id) {
        query['class_id'] = param.class_id;
    }
    if (param.schedule_id) {
        query['schedule_id'] = param.schedule_id;
    }
    let res = yield model.StudentHomework.find(query).sort({createdAt: param.sort == 'asc' ? 1 : -1}).skip(start).limit(count);
    let list = [];
    for (let i = 0; i < res.length; i++) {
        let item = yield res[i].toItem();
        if (item.is_new) {
            yield model.StudentHomework.findByIdAndUpdate(item.swork_id, {$set: {is_new: false}});
        }
        list.push(item);
    }
    return list;
};

/**
 * 学生端获取指定作业的题目列表（不分页）
 * @param param = {userID: '', swork_id: ''}
 * @returns {*}
 */
exports.homeworkDetailList = function *(param) {
    let swork = yield model.StudentHomework.findById(param.swork_id);
    if (!swork) {
        return null;
    }
    return yield swork.toQuestionList(param.userID);
};

/**
 * 学生获取指定作业指定题目的详情
 * @param param = {userID: '', swork_id: '', q_id: ''}
 * @returns {*}
 */
exports.homeworkQuestion = function *(param) {
    let swork = yield model.StudentHomework.findById(param.swork_id);
    if (!swork) {
        return null;
    }
    let question = null;
    for (let i = 0; i < swork.questions.length; i++) {
        if (swork.questions[i].q_id.toString() == param.q_id) {
            question = swork.questions[i].toObject();
            if (question.status == 'pending') {

            }
            let q = yield model.StudyQuestion.findById(param.q_id);
            question.info = q.toObject({getters: true});
            break;
        }
    }
    return question;
};

/**
 * 获取指定作业的下一道未答题目
 * @param param = {swork_id: '', userID: ''}
 * @returns {*}
 */
exports.nextHomeworkQuestion = function *(param) {
    let swork = yield model.StudentHomework.findById(param.swork_id);
    if (!swork) {
        return null;
    }
    let q = {};
    for (let i = 0; i < swork.questions.length; i++) {
        if (swork.questions[i].status == 'pending') {
            if (swork.questions[i].step.length != 0) {
                swork.questions[i].step = [];
                yield swork.save();
            }
            let question = yield model.StudyQuestion.findById(swork.questions[i].q_id);
            q = question.toObject({getters: true});
            break;
        }
    }
    return q;
};

/**
 * 学生端作业答题
 * @param param = {userID: '', swork_id: '', q_id: '', choice_id: ''}
 * @return {*}
 */
exports.sworkCheck = function *(param) {
    let swork = yield model.StudentHomework.findById(param.swork_id);
    let question = yield model.StudyQuestion.findById(param.q_id);
    let point = 0;
    for (let i = 0; i < swork.questions.length; i++) {
        if (swork.questions[i].q_id.toString() == question.root_id.toString()) {
            swork.questions[i].step.push({
                q_id: param.q_id,
                choice_id: param.choice_id,
                type: question.type,
                t: new Date()
            });
            let choice = question.choice.id(param.choice_id);
            if (choice.action == 'result') {
                swork.questions[i].status = 'finished';
                swork.questions[i].startAt = swork.questions[i].step[0].t;
                swork.questions[i].endAt = swork.questions[i].step[swork.questions[i].step.length - 1].t;
                let sPath = yield question.toShortestPath(swork.questions[i].q_id);
                point = (sPath.length / (swork.questions[i].step.length + 1)) * 100;
                swork.questions[i].point = (point > 100 ? 100 : point).toFixed(0);
                //如果题目完成，那么检查一下该作业是否所有题目全部完成，如果全部完成，那么作业状态就设置成完成
                switch (swork.status) {
                    case 'pending': {  //对于pending状态下的作业，判断是否为完成
                        swork.status = 'finished';
                        for (let j = 0; j < swork.questions.length; j++) {
                            if (swork.questions[j].status != 'finished') {
                                swork.status = 'pending';
                            }
                        }
                    }
                        break;
                    case 'timeout': {  //对于timeout状态下的作业，判断是否为补交
                        swork.status = 'timeoutFinished';
                        for (let j = 0; j < swork.questions.length; j++) {
                            if (swork.questions[j].status != 'finished') {
                                swork.status = 'timeout';
                            }
                        }
                    }
                        break;
                }
            }
            yield model.WrongQuestion.addWrongQuestion({    //添加最近错题列表
                userID: param.userID,
                type: 'homework',
                q_id: swork.questions[i].q_id,
                swork_id: swork.swork_id,
                point: swork.questions[i].point
            });
            yield swork.save();
            if (swork.type == 'schedule' && swork.status == 'timeoutFinished') {
                yield model.HomeworkStat.calculateQuestion(swork.schedule_id);
            }
            if (swork.type == 'schedule' && swork.status == 'finished') { //如果作业已完成，那么触发一次计算统计信息的操作
                yield model.HomeworkStat.calculate(swork.schedule_id);
                yield model.HomeworkStat.calculateQuestion(swork.schedule_id);
            }
            break;
        }
    }
    yield model.StudentRecent.addRecent({
        userID: param.userID,
        type: 'homework',
        q_id: question.root_id || param.q_id,
        swork_id: param.swork_id
    });    //添加到最近列表
    {   //将学生做作业的答题过程在exercise中同步一份，为将来统计数据用
        let setObj = {
            $push: {
                step: {
                    q_id: param.q_id,
                    choice_id: param.choice_id,
                    type: question.type
                }
            }
        };
        if (question.choice.id(param.choice_id).action == 'result') {
            setObj['$set'] = {status: 'finished'};
        }
        let e = yield model.StudyExercise.findOneAndUpdate({
            userID: param.userID,
            q_id: question.root_id,
            swork_id: param.swork_id,
            type: 'homework',
            status: 'pending'
        }, setObj, {new: true, upsert: true});
        if (question.choice.id(param.choice_id).action == 'result') {
            yield model.StudyExercise.findByIdAndUpdate(e._id, {$set: {point: (point > 100 ? 100 : point).toFixed(0)}}, {new: true});
        }
    }
    return true;
};

/**
 * 学生端获取指定作业指定题目的结果得分
 * @param param = {swork_id: '', q_id: ''}
 * @returns {{point: number}}
 */
exports.sworkResult = function *(param) {
    let swork = yield model.StudentHomework.findById(param.swork_id);
    let info = {point: 0, status: 'pending', seq: 0, total: 0, current: 0, percent: 100};
    let res = yield [
        model.Class.findById(swork.class_id),
        model.ClassSchedule.findById(swork.schedule_id)
    ];
    info.seq = res[1].seq;
    info.total = swork.questions.length;
    for (let i = 0; i < swork.questions.length; i++) {
        if (swork.questions[i].q_id.toString() == param.q_id) {
            info.point = swork.questions[i].point;
            info.status = swork.questions[i].status;
            info.current = i + 1;
            break;
        }
    }
    let seed = info.point == undefined ? 80 : info.point;
    let percent = Number.parseInt(Math.floor(seed / 10).toFixed(0)) * 10;
    if (percent == 100) {
        percent = 99;
    }
    info.percent = percent;
    return info;
};

/**
 * 学生端获取指定作业指定题目的回顾
 * @param param = {swork_id: '', q_id: ''}
 * @returns {*}
 */
exports.sworkReview = function *(param) {
    let swork = yield model.StudentHomework.findById(param.swork_id);
    let review = {root: '', list: []};
    for (let i = 0; i < swork.questions.length; i++) {
        if (swork.questions[i].q_id.toString() == param.q_id) {
            break;
        }
        let choice_ids = [];
        swork.questions[i].step.forEach(item => {
            if (item.type != 'root') {
                choice_ids.push(item.choice_id);
            }
        });
        let rootq = yield model.StudyQuestion.findById(param.q_id);
        let qlist = yield model.StudyQuestion.find({choice_id: {$in: choice_ids}, 'choice.correct': false});
        if (rootq && rootq.remark) {
            review.root = rootq.remark;
        }
        qlist.forEach(item => {
            if (item && item.remark) {
                review.list.push(item.remark);
            }
        });
    }
    return review;
};

/**
 * 学生获取课时详情
 * @param param
 * @returns {{swork_id: *, class_id: *, class_name: *, version: *, grade: *, subject: *, schedule_id: *, seq: *}}
 */
exports.sworkDetail = function *(param) {
    let swork = yield model.StudentHomework.findById(param.swork_id);
    let res = yield[
        model.ClassSchedule.findById(swork.schedule_id),
        model.Class.findById(swork.class_id)
    ];
    return {
        swork_id: param.swork_id,
        class_id: swork.class_id,
        class_name: res[1].name,
        version: res[1].version,
        grade: res[1].grade,
        subject: res[1].subject,
        schedule_id: swork.schedule_id,
        seq: res[0].seq
    }
};

/**
 * 学生端获取最近列表
 * @param param = {userID: '', start: '', limit: '', type: ''}
 * @returns {Array}
 */
exports.recentList = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let query = {userID: param.userID, $or: [{type: 'homework', endAt: {$gte: new Date()}}, {type: 'exercise'}]};
    if (param.type) {
        query['type'] = param.type;
    }
    let res = yield model.StudentRecent.find(query).sort({updatedAt: -1}).skip(start).limit(count);
    let list = [];
    for (let i = 0; i < res.length; i++) {
        let item = yield res[i].toListItem();
        list.push(item);
    }
    return list;
};

/**
 * 返回作业指定题目的做题步骤列表
 * @param param = {swork_id: '', q_id: ''}
 * @returns {*}
 */
exports.homeworkStep = function *(param) {
    let swork = yield model.StudentHomework.findById(param.swork_id);
    let info = {
        q_id: param.q_id,
        swork_id: param.swork_id,
        status: '',
        point: 0,
        shortestPath: 0,
        step: []
    };
    for (let i = 0; i < swork.questions.length; i++) {
        if (swork.questions[i].q_id.toString() == param.q_id) {
            let item = swork.questions[i];
            info.status = item.status;
            info.point = item.point;
            if (info.status == 'finished') {
                let q = yield model.StudyQuestion.findById(param.q_id);
                let sPath = yield q.toShortestPath();
                info.shortestPath = sPath.length;
                info.step.push(q.toItem());
                for (let j = 0; j < item.step.length; j++) {
                    let q = yield model.StudyQuestion.findById(item.step[j].q_id);
                    let stepItem = q.toItem();
                    stepItem.choice_id = item.step[j].choice_id;
                    stepItem.t = item.step[j].t;
                    info.step.push(stepItem);
                }
            }
            break;
        }
    }
    return info;
};


/**
 * 获取错题本
 * @param param = {userID: '', start: '', limit: ''}
 * @returns {Array}
 */
exports.wrongList = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let query = {userID: param.userID, reviewed: false};
    if (param.type) {
        query['type'] = param.type;
    }
    if (param.subject) {
        query['subject'] = param.subject;
    }
    if (param.grade) {
        query['grade'] = param.grade;
    }
    if (param.version) {
        query['version'] = param.version;
    }
    let res = yield model.WrongQuestion.find(query).sort({updatedAt: -1}).skip(start).limit(count);
    let list = [];
    for (let i = 0; i < res.length; i++) {
        let item = yield res[i].toListItem();
        list.push(item);
    }
    return list;
};

/**
 * 学生获取已绑定的家长列表
 * @param param = {userID: '', start: '', limit: ''}
 * @returns {Array}
 */
exports.getParents = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let query = {s_id: param.userID, status: 'verified', valid: true};
    let res = yield model.ParentStudent.find(query).sort({createdAt: -1}).skip(start).limit(count);
    let list = [];
    for (let i = 0; i < res.length; i++) {
        let item = yield res[i].toParentInfo();
        list.push(item);
    }
    return list;
};

/**
 * 获取指定学生绑定的所有家长的ID
 * @param s_id
 * @returns {*}
 */
exports.getParentIDs = function *(s_id) {
    let query = {s_id: s_id, status: 'verified', valid: true};
    let res = yield model.ParentStudent.find(query);
    return res.map(i => i.p_id);
};

/**
 * 学生解除绑定
 * @param param = {userID: '', p_id: ''}
 * @returns {boolean}
 */
exports.unbindParent = function *(param) {
    let query = {s_id: param.userID, p_id: param.p_id, status: 'verified', valid: true};
    let res = yield model.ParentStudent.find(query);
    for (let i = 0; i < res.length; i++) {
        yield model.ParentStudent.findByIdAndUpdate(res[i]._id, {$set: {valid: false}});
    }
    return true;
};

/**
 * 获取学生统计信息
 * @param param = {userID: ''}
 * @returns {*}
 */
exports.stat = function *(param) {
    // let stat = yield model.StudentStat.findOne({userID: param.userID}).sort({createdAt: -1});
    // if (!stat) {
    //     stat = yield model.StudentStat.calculate(param.userID);
    // }
    let res = yield [
        model.StudyExercise.count({userID: param.userID, status: 'finished', point: 100}),
        model.StudyExercise.count({userID: param.userID, status: 'finished', point: {$gte: 85, $lt: 100}}),
        model.StudyExercise.count({userID: param.userID, status: 'finished', point: {$gte: 60, $lt: 85}}),
        model.StudyExercise.count({userID: param.userID, status: 'finished', point: {$lt: 60}})
    ];
    return {
        userID: param.userID,
        questions: {
            total: res[0] + res[1] + res[2] + res[3],
            perfect: res[0],
            excellent: res[1],
            pass: res[2],
            fail: res[3]
        },
        createdAt: new Date()
    };
};

/**
 * 记录学生最近活动情况
 * @param param = {userID: '', type: '', target_id: '', param: {}}
 */
function* studentRecent(param) {
    let query = {
        userID: param.userID,
        type: param.type,
        target_id: param.target_id
    };
    yield model.StudentRecent.findOneAndUpdate(query, {$set: {param: param.param}}, {upsert: true, new: true});
}




