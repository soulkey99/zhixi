/**
 * Created by MengLei on 2016-09-14.
 */
"use strict";
const model = require('./../../model');

/**
 * 根据school_id获取学校记录
 * @param school_id
 * @returns {*}
 */
exports.getSchoolByID = function *(school_id) {
    return yield model.School.findById(school_id);
};

/**
 * 根据class_id获取班级记录
 * @param class_id
 * @returns {*}
 */
exports.getClassByID = function *(class_id) {
    return yield model.Class.findById(class_id);
};

/**
 * 根据schedule_id获取课时记录
 * @param schedule_id
 * @returns {*}
 */
exports.getScheduleByID = function *(schedule_id) {
    return yield model.ClassSchedule.findById(schedule_id);
};

/**
 * 根据班号来获取班级的记录
 * @param num：班号
 * @returns {*}
 */
exports.getClassByNum = function *(num) {
    return yield model.Class.findOne({class_num: num});
};

/**
 * 获取指定用户创建的学校
 * @param userID
 * @returns {*}
 */
exports.getMySchool = function *(userID) {
    return yield model.School.findOne({master_id: userID});
};

/**
 * 获取教师名下的机构记录
 * @param userID
 * @returns {*}
 */
exports.getTeacherSchool = function *(userID) {
    return yield model.School.findOne({master_id: userID, valid: true});
};
/**
 * 新建一个学校记录
 * @param param = {name: '', city: '', province: '', type: '', master_id: '', master_name: '', master_passwd: '', master_idcard: '', master_email: '', }
 * @returns {*}
 */
exports.createSchool = function *(param) {
    let school = new (model.School)();
    school.name = param.name || '';
    school.province = param.province || '';
    school.city = param.city || '';
    if (school.type) {
        school.type = param.type;
    }
    school.master_id = param.master_id;
    school.master_name = param.master_name || '';
    school.master_passwd = param.master_passwd || '';
    school.master_id_num = param.master_id_num || '';
    school.master_email = param.master_email || '';
    school.master_qq = param.master_qq || '';
    school.master_weixin = param.master_weixin || '';
    return yield school.save();
};

/**
 * 更新学校的记录
 * @param param = {name: '', city: '', province: '', type: '', master_passwd: '', master_name: '', master_id_num: '', master_email: '', master_qq: '', master_weixin: '', remark: '', status: '', id_front: '', id_back: '', id_num: '', org_name: '', org_license: '', admin_proof: '', org_num: '', org_capital: ''}
 * @returns {*}
 */
exports.editSchool = function *(param) {
    let setObj = {};
    if (param.name) {
        setObj['name'] = param.name;
    }
    if (param.city) {
        setObj['city'] = param.city;
    }
    if (param.province) {
        setObj['province'] = param.province;
    }
    if (param.type) {
        setObj['type'] = param.type;
    }
    if (param.master_passwd) {
        setObj['master_passwd'] = param.master_passwd;
    }
    if (param.master_name) {
        setObj['master_name'] = param.master_name;
    }
    if (param.master_id_num) {
        setObj['master_id_num'] = param.master_id_num;
    }
    if (param.master_email) {
        setObj['master_email'] = param.master_email;
    }
    if (param.master_qq) {
        setObj['master_qq'] = param.master_qq;
    }
    if (param.master_weixin) {
        setObj['master_weixin'] = param.master_weixin;
    }
    if (param.remark) {
        setObj['remark'] = param.remark;
    }
    if (param.status) {
        setObj['status'] = param.status;
    }
    if (param.id_front) {
        setObj['id_front'] = param.id_front;
    }
    if (param.id_back) {
        setObj['id_back'] = param.id_back;
    }
    if (param.id_num) {
        setObj['id_num'] = param.id_num;
    }
    if (param.org_name) {
        setObj['org_name'] = param.org_name;
    }
    if (param.org_license) {
        setObj['org_license'] = param.org_license;
    }
    if (param.admin_proof) {
        setObj['admin_proof'] = param.admin_proof;
    }
    if (param.org_num) {
        setObj['org_num'] = param.org_num;
    }
    if (param.org_capital) {
        setObj['org_capital'] = param.org_capital;
    }
    if (param.org_people_num) {
        setObj['org_people_num'] = param.org_people_num;
    }
    return yield model.School.findByIdAndUpdate(param.school_id, {$set: setObj}, {new: true});
};

/**
 * 获取班级学生列表
 * @param param = {class_id: '', start: '', limit: ''}
 * @returns {*}
 */
exports.classStudent = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let query = {class_id: param.class_id, valid: true, status: 'verified'};
    let res = yield model.ClassStudent.find(query, {s_id: 1}).sort({createdAt: 1}).skip(start).limit(count);
    let s_ids = res.map(i=>i.s_id);
    let res2 = yield model.UserS.find({_id: {$in: s_ids}}, {nick: 1, name: 1, avatar: 1});
    return res2.map(i=>i.toSimpleInfo());
};


/**
 * 创建班级
 * @param param = {name: '', school_id: '', t_id: '', grade: '', subject: '', version: '', duration: '', startAt: '', endAt: '', week: '', week_num: '', day: '', hour: ''}
 * @returns {*}
 */
exports.createClass = function *(param) {
    let num = 100000;
    let c0 = yield model.Class.findOne({}, {class_num: 1}).sort({class_num: -1});
    if (c0) {   //班号，自增，先取系统中已存在的最大号码，加1作为最新班号
        num = c0.class_num + 1;
    }
    let c = new (model.Class)();
    c.name = param.name;
    c.class_num = num;
    c.school_id = param.school_id;
    c.t_id = param.t_id;
    c.grade = param.grade;
    c.subject = param.subject;
    c.version = param.version;
    c.duration = param.duration;
    c.startAt = param.startAt || new Date();  //开班时间，如果没客户端没传，就设置为今天
    if (param.endAt) {  //结班时间，如果传了，就设置
        c.endAt = param.endAt;
    }
    c.week = param.week;
    c.week_num = param.week_num.split(',');
    c.noon = param.noon;
    c.hour = param.hour;
    c.minute = param.minute || 0;
    yield c.save();
    // {  //创建todolist中的数据，从现在开始的28天内数据
    //     let t1 = new Date(c.startAt);   //开始日期
    //     let t2 = new Date(Date.now() + 27 * 24 * 60 * 60 * 1000);     //截止日期，从当前日期开始算起加27天，这样，算上当前日期一共28天
    //     if (c.endAt) {
    //         t2 = new Date(Math.min(t2.getTime(), c.endAt.getTime())); //取t2和28天后的时间点中比较小的那个值
    //     }
    //     t1.setHours(0, 0, 0, 0);
    //     let t0 = new Date(t1);   //开始时间，下面计算双周单周时有用
    //     t2.setHours(23, 59, 59, 999);
    //     for (; t1 < t2; t1.setDate(t1.getDate() + 1)) {
    //         if (c.week == 'double' && Math.floor((t1 - t0) / 86400 / 7 / 1000) % 2 == 1) {
    //             continue;   //对于双周排课的情况要特殊处理
    //         }
    //         if (c.week_num.indexOf(t1.getDay().toString()) >= 0) {
    //             let todo = new (model.Todo)();
    //             todo.userID = c.t_id;
    //             todo.type = 'schedule';
    //             todo.class_id = c.class_id;
    //             todo.school_id = c.school_id;
    //             let time = new Date(t1);
    //             time.setHours(c.hour + (c.noon == 'after' ? 12 : 0), c.minute);
    //             todo.startAt = time;
    //             todo.endAt = new Date(todo.startAt.getTime() + c.duration * 60 * 1000);
    //             yield todo.save();
    //         }
    //     }
    // }

    // //创建schedule，TODO：创建多少个课时
    let t1 = new Date(c.startAt);   //开始日期
    let t2 = new Date(c.endAt);     //截止日期
    t1.setHours(0, 0, 0, 0);
    t2.setHours(23, 59, 59, 999);
    let seq = 1;    //课时序号
    for (; t1 < t2; t1.setDate(t1.getDate() + 1)) {
        if (c.week == 'double' && Math.floor((t2 - t1) / 86400 / 7 / 1000) % 2 == 1) {
            continue;   //对于双周排课的情况要特殊处理
        }
        if (c.week_num.indexOf(t1.getDay().toString()) >= 0) {
            let schedule = new (model.ClassSchedule)();
            schedule.school_id = c.school_id;
            schedule.class_id = c.class_id;
            schedule.t_id = c.t_id;
            schedule.seq = seq;
            seq++;
            let time = new Date(t1);
            time.setHours(c.hour + (c.noon == 'after' ? 12 : 0), c.minute);
            schedule.startAt = time;
            schedule.duration = c.duration;
            schedule.endAt = new Date(schedule.startAt.getTime() + c.duration * 60 * 1000);
            yield schedule.save();
        }
    }
    return c;
};

/**
 * 编辑编辑信息
 * @param param = {name: '', duration: ''}
 * @returns {*}
 */
exports.editClass = function *(param) {
    let setObj = {};
    if (param.name) {
        setObj['name'] = param.name;
    }
    if (param.duration) {
        setObj['duration'] = param.duration;
    }
    return yield model.Class.findByIdAndUpdate(param.class_id, {$set: setObj}, {new: true});
};


/**
 * 编辑课时计划
 * @param param = {schedule_id: '', plan: ''}
 * @returns {*}
 */
exports.editClassSchedule = function *(param) {
    return yield model.ClassSchedule.findByIdAndUpdate(param.schedule_id, {$set: {plan: param.plan}});
};

/**
 * 获取课程课时计划列表
 * @param param = {class_id: '', start: '', limit: ''}
 * @returns {Array}
 */
exports.getClassSchedule = function *(param) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let res = yield model.ClassSchedule.find({class_id: param.class_id}).sort({startAt: 1}).skip(start).limit(count);
    let list = [];
    for (let i = 0; i < res.length; i++) {
        list.push({seq: i + start + 1, schedule_id: res[i].schedule_id, startAt: res[i].startAt, plan: res[i].plan});
    }
    return list;
};




