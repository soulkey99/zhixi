/**
 * Created by MengLei on 2016-09-30.
 */
"use strict";
const logger = require('../../../utils/logs').task;
const co = require('co');

/**
 * 定时任务，自动发布作业，自动设置作业超时
 */
exports.auto_publish_homework = function () {
    co(gfunc).then(() => {
        logger.trace('auto publish homework task finished.');
    }, (err) => {
        logger.trace('auto publish homework task error: ' + err.message);
    });
    function *gfunc() {
        let res = yield [
            model.ClassSchedule.find({homework_status: 'draft', endAt: {$lte: new Date(Date.now() - 3600000)}}), //一个小时前结束的草稿状态作业自动发布
            model.ClassSchedule.find({homework_status: 'waiting', endAt: {$lte: new Date() - 3600000}})    //一个小时前结束的没布置作业的课时自动置为超时
        ];
        for (let i = 0; i < res[0].length; i++) {  //超时草稿状态的作业自动发布
            let schedule = res[0][i];
            if (!schedule.homework_auto) {  //如果不是自动发布，那么不继续
                continue;
            }
            if (schedule.questions.length == 0) {   //如果没有题，也不继续，置成超时
                yield model.ClassSchedule.findByIdAndUpdate(schedule._id, {$set: {homework_status: 'timeout'}});
                continue;
            }
            yield schedule.publish();
            yield model.HomeworkStat.calculate(schedule.schedule_id);
        }
        for (let i = 0; i < res[1].length; i++) {
            yield model.ClassSchedule.findByIdAndUpdate(res[1][i]._id, {$set: {homework_status: 'timeout'}});
        }
    }
};

/**
 * 定时任务，自动统计作业数据
 */
exports.auto_stat_homework = function () {
    let point_threshold = 100;   //题目正确与错误的分界值
    co(gfunc).then(() => {
        logger.trace('auto stat homework task finished.');
    }, (err) => {
        logger.trace('auto stat homework task error: ' + err.message);
    });
    function *gfunc() {
        let sworks = yield model.StudentHomework.find({
            endAt: {$lt: new Date()},
            type: 'schedule',
            status: {$in: ['finished', 'pending']}
        });
        for (let i = 0; i < sworks.length; i++) {
            let setObj = {status: 'submitted'};
            for (let j = 0; j < sworks[i].questions.length; j++) {
                if (sworks[i].questions[j].status != 'finished') {
                    setObj.status = 'timeout';
                    break;
                }
            }
            yield model.StudentHomework.findByIdAndUpdate(sworks[i]._id, {$set: setObj});
        }
        let schedules = yield model.ClassSchedule.find({
            homework_status: 'assigned',
            homework_endAt: {$lte: new Date()},
            homework_stat_id: null
        });
        for (let i = 0; i < schedules.length; i++) {
            let stat = new (model.HomeworkStat)();
            stat.schedule_id = schedules[i]._id;
            stat.class_id = schedules[i].class_id;
            let sworks = yield model.StudentHomework.find({schedule_id: schedules[i]._id, type: 'schedule'});
            stat.student_total = sworks.length;
            stat.question_stat = schedules[i].questions.map(q_id => ({q_id, wrong_count: 0}));
            stat.student_stat = sworks.map(swork => ({s_id: swork.s_id, wrong_count: 0}));
            for (let i = 0; i < sworks.length; i++) {
                if (sworks[i].status == 'finished' || sworks[i].status == 'submitted') {
                    stat.student_finished++;
                } else {
                    stat.unfinished_students.push(sworks[i].s_id);
                }
                for (let j = 0; j < stat.student_stat.length; j++) {    //学生数据
                    if (stat.student_stat[j].s_id.toString() == sworks[i].s_id.toString()) {
                        stat.student_stat[j].status = sworks[i].status;
                        for (let k = 0; k < sworks[i].questions.length; k++) {
                            if (sworks[i].questions[k].status == 'finished') {
                                if (sworks[i].questions[k].point < point_threshold) {   //错题数量
                                    stat.student_stat[j].wrong_count++;
                                } else {
                                    stat.student_stat[j].correct_count++;
                                }
                            }
                            for (let l = 0; l < stat.question_stat.length; l++) {   //题目数据
                                if (stat.question_stat[l].q_id.toString() == sworks[i].questions[k].q_id.toString()) {
                                    if (sworks[i].questions[k].status == 'finished') {
                                        if (sworks[i].questions[k].point < point_threshold) {   //错题数量
                                            stat.question_stat[l].wrong_count++;
                                        } else {
                                            stat.question_stat[l].correct_count++;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            stat.question_stat.sort((a, b) => b.wrong_count - a.wrong_count);
            stat.student_stat.sort((a, b) => b.wrong_count - a.wrong_count);
            yield stat.save();
            yield model.ClassSchedule.findByIdAndUpdate(schedules[i]._id, {$set: {homework_stat_id: stat._id}});
        }
    }
};

/**
 * 定时任务，自动将未完成的作业设置为超时
 */
exports.auto_timeout_homework = function () {
    co(gfunc).then(() => {
        logger.trace('auto timeout homework task finished.');
    }, (err) => {
        logger.trace('auto timeout homework task error: ' + err.message);
    });
    function *gfunc() {
        let query = {
            endAt: {$lt: new Date()},
            status: 'pending',
            type: 'schedule'
        };
        let sh = yield model.StudentHomework.find(query);
        let s = new Set();
        sh.forEach(i => s.add(i.schedule_id.toString()));
        let schedule_ids = Array.from(s);
        if (schedule_ids.length > 0) {
            for (let i = 0; i < schedule_ids.length; i++) {
                yield model.HomeworkStat.calculate(schedule_ids[i]);
            }
            yield model.StudentHomework.update(query, {$set: {status: 'timeout'}}, {multi: true});
        }
    }
};

/**
 * 定时任务，维护教师todolist
 */
exports.todo_task = function () {
    co(gfunc).then(() => {
        logger.trace('auto maintain todolist task finished.');
    }, (err) => {
        logger.trace('auto maintain todolist task error: ' + err.message);
    });
    function *gfunc() {
        let cArray = yield model.Class.find({valid: true});
        for (let i = 0; i < cArray.length; i++) {
            let c = cArray[i];
            let t0 = new Date(c.startAt);
            let t = new Date(Date.now() + 27 * 24 * 60 * 60 * 1000);
            t0.setHours(0, 0, 0, 0);
            t.setHours(0, 0, 0, 0);
            if (c.endAt && c.endAt < t) {
                continue;  //结课时间小于28天情况
            }
            if (c.week == 'double' && (Math.floor(t - t0) / 86400 / 7 / 1000) % 2 == 1) {
                continue;   //双周排课情况特殊处理
            }
            if (c.week_num.indexOf(t.getDay().toString()) >= 0) {//满足星期要求，增加一条todo记录
                let time = new Date(t);
                time.setHours(c.hour + (c.noon == 'after' ? 12 : 0), c.minute);
                let todo = yield model.Todo.findOne({class_id: c.class_id, startAt: time});
                if (todo) { //如果这个时间的数据已经存在，就不必生成了
                    continue;
                }
                todo = new (model.Todo)();
                todo.userID = c.t_id;
                todo.type = 'schedule';
                todo.class_id = c.class_id;
                todo.school_id = c.school_id;
                todo.startAt = time;
                todo.endAt = new Date(todo.startAt.getTime() + c.duration * 60 * 1000);
                yield todo.save();
            }
        }
    }
};

exports.student_stat_task = function () {
    co(model.StudentStat.calculate).then(() => {
        logger.trace('auto student stat task finished.');
    }, (err) => {
        logger.trace('auto student stat task error: ' + err.message);
    });
};

