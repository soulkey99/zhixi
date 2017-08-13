/**
 * Created by MengLei on 2016-08-26.
 */
"use strict";
const co = require('co');
global.logger = require('../utils/logs').some;
global.validator = require('validator');
const xlsx = require('node-xlsx');
const CronJob = require('cron').CronJob;
const ObjectId = require('mongoose').Types.ObjectId;
const model = require('./model');
const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const proxy = require('./proxy');
const request = require('request');
global.proxy = proxy;
const pingpp = require('pingpp')('sk_test_C4qjfHerzHW1uDuvrPqPO4W9');
function exec(func) {
    co(func).then(function (resp) {
        console.log(JSON.stringify(resp));
    }, function (err) {
        console.log(err);
    });
}
function cb(err, resp) {
    console.log(err);
    console.log(resp);
}

// exec(proxy.Student.getUserById('57bfb8a65fe68d2c37013c35'));
// exec(proxy.Student.createUser({phone: 'ddd', passwd: 'ccc', nick: 'bbb', avatar: 'aaa'}))
// exec(proxy.StudyVersion.getList({}, cb));
// proxy.StudyVersion.getList({}, cb);
// exec(proxy.UserSession.getNextSession({access_token: '5dbfcb81da0a2b28b344563a39942f21873e2267edeb8729'}));
// console.log(validator.isMongoId('57bfb8a65fe68d2c37013c35'))
// exec(proxy.Teacher.addStudent({school_id: '57df43258bef4e802794dd0e', class_id: '57df4665053c674808325fe6', s_id: '57c4e70ff6d95f282d9729fa,57c927c6be55b1ef6c73eeac'}));
// exec(proxy.Student.getMyClass({userID: '57c4e70ff6d95f282d9729fa'}));
// exec(proxy.School.getClassSchedule({class_id: '57df4665053c674808325fe6', start: 1, limit: 30}));
// exec(proxy.School.editClassSchedule({schedule_id: '57df94cea824a5b41f25d8ad', plan: '1.5'}))
// co(function *() {
//     let res = yield model.StudyVersion.aggregate(
//         {$group: {_id: '$version'}}
//     );
//     let list = [];
//     for (let i = 0; i < res.length; i++) {
//         let item = yield model.StudyVersion.find({version: res[i]._id}).sort({seq: 1});
//         list.push({
//             version: res[i]._id,
//             grades: item.map(i=>i.grade)
//         });
//     }
//     console.log(list);
// });
// exec(proxy.Student.getMsg({userID: '57c4e70ff6d95f282d9729fa'}));
// exec(proxy.Msg.createMsg({to: 'all', content: 'test broadcast to all', param: {p1: 'p1', p2: 'p2'}}));
// exec(proxy.Msg.createUserMsg({type: 'system', to: '57c4e70ff6d95f282d9729fa', toType: 's', content: 'test system to user student', param: {p1: 'p1', p2: 'p2'}}));
// exec(proxy.Student.getClassJoinHistory({userID: '57c4e70ff6d95f282d9729fa'}))
// exec(proxy.Teacher.classJoinList({userID: '57df43258bef4e802794dd0d'}));
// exec(proxy.Teacher.assignHomework({schedule_id: '57df94cea824a5b41f25d8ad', userID: '57df43258bef4e802794dd0d', endAt: '2016-09-25 10:00:00', q_id: '570b36832119225382351b6c,575512a05d7ae0c3460e7412,57553d3f62cc0870779a61db'}));
// exec(proxy.Study.getCatalog({version: '北师大版', grade: '七年级上', subject: '数学'}));
// exec(proxy.Study.getSectionQuestion({sec_id: '57624369d926b5352c47cb91'}));
// exec(proxy.Student.homeworkDetailList({userID: '57c927c6be55b1ef6c73eeac', swork_id: '57e4cf6ae83bdfa0296dbd04'}));
// exec(proxy.Student.tree('57d4ba03f8513c197b1c2abe'));
// exec(function *() {
//     let query = {userID: '57df43258bef4e802794dd0d', type: 'e', target_id: '57e4cf6ae83bdfa0296dbd04'};
//     yield model.StudentRecent.findOneAndUpdate(query, {$set: {param: {e: 'f'}}}, {upsert: true, new: true});
// });
// exec(proxy.Study.exerciseVersionList({}))
// exec(function*() {
//     let c = yield model.Class.findById('57eb41ffc4fc90714d776424');
//     let t1 = new Date(c.startAt);   //开始日期
//     let t2 = new Date(c.endAt);     //截止日期
//     // t1.setHours(0, 0, 0, 0);
//     // t2.setHours(0, 0, 0, 0);
//     let seq = 1;    //课时序号
//     for (; t1 < t2; t1.setDate(t1.getDate() + 1)) {
//         if (c.week == 'double' && Math.floor((t2 - t1) / 86400 / 7 / 1000) % 2 == 1) {
//             continue;   //对于双周排课的情况要特殊处理
//         }
//         if (c.week_num.indexOf(t1.getDay().toString()) >= 0) {
//             let time = new Date(t1);
//             time.setHours(c.hour + (c.noon == 'after' ? 12 : 0), c.minute);
//             console.log(`time: ${time.toString()}, seq: ${seq}, day: ${time.getDay()}, noon: ${c.noon}`);
//             seq++;
//             // let schedule = new (model.ClassSchedule)();
//             // schedule.school_id = c.school_id;
//             // schedule.class_id = c.class_id;
//             // schedule.t_id = c.t_id;
//             // schedule.seq = seq;
//             // seq++;
//             // let time = new Date(t1);
//             // time.setHours(c.hour + (c.noon == 'after' ? 12 : 0), c.minute);
//             // schedule.startAt = time;
//             // schedule.duration = c.duration;
//             // schedule.endAt = new Date(schedule.startAt.getTime() + c.duration * 60 * 1000);
//             // yield schedule.save();
//         }
//     }
// });
// exec(proxy.Task.homework());
// exec(proxy.Study.getCatalog({ver_id: '5786e9f086bd1c8379152247'}));
// exec(proxy.Study.versionProcess({userID: '55a9e634556e104537d8e61b', ver_id: '5786e9f086bd1c8379152247'}));
// exec(proxy.Study.getQuestionsByIDs(['5787472286bd1c83791522b1','57874fd886bd1c83791522bf']));
// exec(proxy.Teacher.getMyClass({userID: '57df43258bef4e802794dd0d'}));
// exec(proxy.Study.genExercise({userID: '57c4e70ff6d95f282d9729fa', sec_id: '57624369d926b5352c47cb91', q_id: '5760eef2d926b5352c47cb61'}));
// exec(proxy.Study.checkQuestion({userID: '57c4e70ff6d95f282d9729fa', e_id: '57fb5c90054b011c262eb6ef', q_id: '570cb11ca130264826afe51b', choice_id: '570cb11ca130264826afe51a'}));
// exec(proxy.Study.sectionNext({userID: '57c4e70ff6d95f282d9729fa', sec_id: '57624369d926b5352c47cb91'}))
// exec(proxy.Student.sworkCheck({userID: '57c4e70ff6d95f282d9729fa', swork_id: '57e4cf6ae83bdfa0296dbd04', q_id: '575546e462cc0870779a61ff', choice_id: '5755472f62cc0870779a6200'}));
// exec(proxy.Teacher.assignHomework({schedule_id: '57df94cea824a5b41f25d8ad', userID: '57df43258bef4e802794dd0d', endAt: '2016-09-25 10:00:00', qlist: [{chapter_id: '', question_ids: ['570b36832119225382351b6c', '575512a05d7ae0c3460e7412']}, {chapter_id: '', question_ids: ['57553d3f62cc0870779a61db', '575512a05d7ae0c3460e7412']}]}));
// exec(model.StudentRecent.addRecent({userID: '57c4e70ff6d95f282d9729fa', type: 'homework', swork_id: '57e4cf6ae83bdfa0296dbd04', ver_id: '', sec_id: '', q_id: '570cb11ca130264826afe51b'}));
// exec(proxy.Teacher.todoList({userID: '57e4be6bbb3561f91174e9f9', limit: '10'}));
// exec(model.StudyChapter.findOne({sections: '57624369d926b5352c47cb91'}));
// exec(proxy.Task.auto_publish_homework());
// exec(proxy.Student.sworkReview({swork_id: '57e4cf6ae83bdfa0296dbd04', q_id: '575512a05d7ae0c3460e7412'}));
// exec(proxy.Study.getReview('57ff017fad6aaa9e01f708a6'));
// exec(proxy.Student.homeworkList({userID: '57fa0ae3c5db9b850ef7fb76'}));
// exec(proxy.Teacher.scheduleHomeworkStat('57fde9bf8de68c9662a55150'))
// proxy.Task.auto_stat_homework();
// exec(proxy.Teacher.unfinishedHomeworkStudentList({schedule_id: '57fde9bf8de68c9662a55150'}));
// exec(proxy.Student.homeworkList({userID: '57c927c6be55b1ef6c73eeac'}));
// exec(proxy.Student.sworkCheck({userID: '57c927c6be55b1ef6c73eeac', swork_id: '5800a598bf9a86865d2b659d', q_id: '57874b6286bd1c83791522bb', choice_id: '57874b7286bd1c83791522bc'}));
// exec(proxy.Study.testFullQuestion());
// exec(proxy.Study.nextSection({sec_id: '57873b1986bd1c837915229c'}))
// exec(proxy.Student.sworkDetail({swork_id: '57e4cf6ae83bdfa0296dbd04'}))
//
// exec(proxy.Study.nextSectionQuestion({userID: '55a9e634556e104537d8e61b', sec_id: '5786f5f686bd1c837915224e'}))
// exec(model.StudyQuestion.shortestPath('5763ab52d926b5352c47cbfe'));
// exec(proxy.Student.nextHomeworkQuestion({swork_id: '5803ff6840b4bf6462c7ce1c'}));
// exec(model.WrongQuestion.addWrongQuestion({userID: '55a9e634556e104537d8e61b', q_id: '57625c67d926b5352c47cb92', point: '87', type: 'exercise', sec_id: '57624369d926b5352c47cb91'}));
// exec(proxy.Student.wrongList({userID: '55a9e634556e104537d8e61b'}));
// exec(proxy.Study.versionProcess({userID: '57ff2d9d2ba2a6ac51113516', ver_id: '5786e9f086bd1c8379152247'}))
// exec(proxy.Student.homeworkStep({swork_id: '57e4cf6ae83bdfa0296dbd04', q_id: '57553d3f62cc0870779a61db'}))
// exec(proxy.Study.nextSectionQuestion({userID: '57ff2d9d2ba2a6ac51113516', sec_id: '57aaa6aa86bd1c8379152ca2'}))
// exec(proxy.Study.exerciseSteps({e_id: '580879b11f621f73126c8569'}));
// exec(model.StudyQuestion.shortestPath());
// exec(proxy.Study.shortestPath('5799529a86bd1c8379152760'));

// require('./proxy/other/task').todo_task();
function *gfunc() {
    let cArray = yield model.Class.find({valid: true});
    let t1 = new Date();
    let t2 = new Date('2016-11-28');
    t1.setHours(0, 0, 0, 0);
    t2.setHours(23, 59, 59, 999);
    for (; t1 < t2; t1.setDate(t1.getDate() + 1)) {
        for (let i = 0; i < cArray.length; i++) {
            let c = cArray[i];
            let t0 = new Date(c.startAt);
            let t = new Date(t1);
            t0.setHours(0, 0, 0, 0);
            t.setHours(0, 0, 0, 0);
            if (c.endAt && c.endAt < t) {
                continue;  //节课时间小于28天情况
            }
            if (c.week == 'double' && (Math.floor(t - t0) / 86400 / 7 / 1000) % 2 == 1) {
                continue;   //双周排课情况特殊处理
            }
            if (c.week_num.indexOf(t.getDay().toString()) >= 0) {//满足星期要求，增加一条todo记录
                let time = new Date(t);
                time.setHours(c.hour + (c.noon == 'after' ? 12 : 0), c.minute);
                let todo = yield model.Todo.findOne({class_id: c.class_id, startAt: time});
                if (todo && todo.valid) { //如果这个时间的数据已经存在，就不必生成了
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
}
//
// exec(function *() {
//     let stat = yield model.HomeworkStat.calculate('57ee217e8a1c2260476f4217');
//     return yield stat.toInfo();
// });
// exec(proxy.Teacher.additionHomeworkList({schedule_id: '57ee217e8a1c2260476f4217'}));
// exec(proxy.Teacher.sworkQuestionSteps({swork_id: '580720f8dd8eefe475e94435', q_id: '5786f3e686bd1c837915224a'}));
// exec(model.HomeworkStat.calculate('57ee0aadb61e79e815662e29'));
// exec(proxy.Student.sworkResult({swork_id: '581bff0ef9d556a03fc0e1d0', q_id: '5786f7dd86bd1c8379152252'}))
// exec(proxy.Teacher.sworkQuestionSteps({swork_id: '57e4cf6ae83bdfa0296dbd04', q_id: '575512a05d7ae0c3460e7412'}));
// exec(proxy.Teacher.homeworkStatStudentDetail({s_id: '57ff2d9d2ba2a6ac51113516', schedule_id: '57fdef7bc700c30364ea7f8c'}));
// exec(proxy.Teacher.homeworkStatStudentDetail({swork_id: '581aea0fed177a1d5bd0ff9e'}));
// exec(model.HomeworkStat.calculate('58180b3267bd44ff4e5a3a59'));
// exec(proxy.Student.homeworkList({userID: '57c927c6be55b1ef6c73eeac'}))
// exec(require('../appServer/utils/weixin').sendMsg({userID: '582193c0c930589d262f4d02', userType: 'p', msg: 'test'}));
// exec(proxy.Teacher.addHomeworkFeedback({userID: '57df43258bef4e802794dd0d', schedule_id: '57df94cea824a5b41f25d8ad', s_id: '57c4e70ff6d95f282d9729fa', content: 'hello world.'}));
// exec(proxy.Teacher.homeworkFeedback({userID: '57df43258bef4e802794dd0d', schedule_id: '57df94cea824a5b41f25d8ad', s_id: '57c4e70ff6d95f282d9729fa'}))
// exec(proxy.Student.getParents({userID: '58202b1b59eb44a329ed32d3'}))
// exec(proxy.Student.unbindParent({userID: '58202b1b59eb44a329ed32d3', p_id: '582193c0c930589d262f4d02'}))
// require('./../appServer/utils/wxMsg').bindMsg({p_id: '582193c0c930589d262f4d02', s_id: '58202b1b59eb44a329ed32d3'})
// exec(require('./../appServer/utils/wxMsg').sendFeedbackMsg({
//     s_id: '58202b1b59eb44a329ed32d3',
//     content: 'hello world.'
// }));
// exec(require('./../appServer/utils/wxMsg').bindMsg({p_id: '582193c0c930589d262f4d02', s_id: '58202b1b59eb44a329ed32d3'}))
// exec(require('./../appServer/utils/weixin').sendNewsMsg({
//     openid: 'olANHwTvEpvSQo_ZD_9Jmp5_7s-0',
//     title: '最近一次的作业',
//     url: 'http://www.baidu.com',
//     description: '最近一次的作业。',
//     picurl: 'http://oss.soulkey99.com/zhixi/2016-11-10/89fd89cd157ca4def8d3964b9f966222.jpg'
// }));
// exec(proxy.Msg.getMsg({userID: '57c927c6be55b1ef6c73eeac', userType: 's'}))
// exec(proxy.Teacher.feedbackTemplate({}))
// exec(require('../appServer/rest/weixin').onWXMsg({
//     "_id" : "5824305df5470c730fcf2819",
//     "toUserName" : "gh_75ef3a15888a",
//     "fromUserName" : "olANHwTvEpvSQo_ZD_9Jmp5_7s-0",
//     "msgType" : "event",
//     "event" : "CLICK",
//     "eventKey" : "LAST_FEEDBACK",
//     "__v" : 0
// }));
// exec(proxy.Teacher.homeworkStatStudentDetail({swork_id: '57ff46092ba2a6ac511137aa'}));
// exec(require('../appServer/utils/weixin').api.createTmpQRCode(1, 120));
// exec(function *() {
//     let schedules = yield model.ClassSchedule.find({schedule_id: null});
//     for (let i = 0; i < schedules.length; i++) {
//         yield schedules[i].calculate();
//         console.log(`calculate ${i + 1}`);
//     }
//     console.log('ok');
// });
// exec(function *() {
//     let sd = yield model.HomeworkStat.findById('57ff5f859cf439e427b14918');
//     return yield sd.toInfo();
// });
// exec(function *() {
//     return yield proxy.Teacher.unfinishedHomeworkStudentList({schedule_id: '582699cb4bd6c144105ccbf5'})
// });
// proxy.Task.auto_timeout_homework();
// exec(proxy.Student.stat({userID: '57ff2d9d2ba2a6ac51113516'}));
// proxy.Task.auto_timeout_homework();
// let job = new CronJob('* * * * * *', ()=>{
//     console.log('on tick.');
// }, ()=>{
//     console.log('on complete.');
// }, true, null, null, false);
// console.log('before start.');
// job.start();
// console.log('after start.');
// setTimeout(function () {
//     console.log('before stop.');
//     job.stop();
//     console.log('after stop.')
// }, 5000);

// exec(proxy.Study.questionExercise({userID: '55a9e634556e104537d8e61b', q_id: '5786f3e686bd1c837915224a'}));
// exec(proxy.Study.exerciseSteps({e_id: '578c744aa415229579a79d16'}));
// exec(proxy.wxDemo1.highSchoolList({key: '实验'}));
// exec(proxy.wxDemo1.addQuestion({
//     type: 'step',
//     content: '这里是步骤5',
//     root_id: '58451078a2c5c021988fd86c',
//     choice: [
//         {content: '选项1', action: 'next', correct: true, flag: 'A', hint: ''},
//         {content: '选项2', action: 'hint', correct: false, flag: 'D', hint: '提示2'},
//         {content: '选项3', action: 'hint', correct: false, flag: 'D', hint: '提示3'},
//         {content: '选项4', action: 'hint', correct: false, flag: 'D', hint: '提示4'}
//     ],
//     point: ['知识点1', '知识点2', '知识点3'],
//     difficulty: 1,
//     remark: '备注'
// }));

// exec(proxy.wxDemo1.nextEQuestion('584516fa78619a1fe8584139'));
// exec(proxy.wxDemo1.getQuestionByID('58450b54367248130ca22875'));
// exec(proxy.wxDemo1.check({
//     userID: '584509633b06901b6412d86d',
//     e_id: '584516fa78619a1fe8584139',
//     q_id: '58450b54367248130ca22876',
//     choice_id: '58450b54367248130ca22875'
// }));

// exec(proxy.Student.sworkResult({swork_id: '58000ae851f3654e6d670d63', q_id: '57bd4fba86bd1c8379153060'}));
// exec(proxy.wxDemo1.getReport('584516bfd3bb212a98836eb0'));
// exec(proxy.wxDemo1.shortReport({userID: '57c7cae4d44e4a506c8086bd'}));

// exec(function *() {
//     let p = new (model.wxdemo2Point)();
//     p.type = 'sub_point';
//     p.content = '概率初步';
//     p.parent_id = '585ba2d0f4bb7917247ae84a';
//     // p.seq = 1;
//     return yield p.save();
// });

// exec(proxy.wxDemo2.pointGraph());

// exec(function *() {
//     let e = yield model.wxdemo2Exercise.findById('585cedf8d7976d40b019d9b0');
//     return yield e.calculate();
// });

// exec(proxy.wxDemo2.nextEQuestion('5874bdc5ae5c2dbd40b8d69a'));
exec(proxy.wxDemo2.check({userID: '57c7cae4d44e4a506c8086bd', e_id: '5874c0daad68445446f522b6', q_id: '584509633b06901b6412d86d', choice_id: '584509633b06901b6412d86b'}));


// exec(proxy.wxDemo2.nextEQuestion('586dfe18ec148c2b207a8d0c'));

// exec(proxy.wxDemo2.improveStrategy({userID: '584509633b06901b6412d86d', e_id: '585cedf8d7976d40b019d9b0'}));

// exec(function *() {
//     let e = yield model.wxdemo2Exercise.findById('585cedf8d7976d40b019d9b0');
//     yield e.calculate();
// });

// exec(proxy.wxDemo2.check({
//     e_id: '585cedf8d7976d40b019d9b0',
//     userID: '584509633b06901b6412d86d',
//     q_id: '584e7b6ba2c5c021988fd88f',
//     choice_id: '584510a1ff04a520f094c731'
// }));

// exec(function *() {
//     let p_list = [];
//     let id = '585b900cae26aa42d86b07a2';
//     let root = yield getRoot(id);
//     return yield getFullList(root.point_id);
//
//     function *getRoot(id) {
//         let p = yield model.wxdemo2Point.findById(id);
//         if (p.parent_id) {
//             return yield getRoot(p.parent_id);
//         } else {
//             return p;
//         }
//     }
//
//     function *getFullList(root_id) {
//         let list = [];
//         let root = yield model.wxdemo2Point.findById(root_id);
//         list.push(root.toInfo());
//         let sub_points = yield model.wxdemo2Point.find({parent_id: root.point_id});
//         for (let i = 0; i < sub_points.length; i++) {
//             list.push(sub_points[i].toInfo());
//             let items = yield model.wxdemo2Point.find({parent_id: sub_points[i].point_id});
//             for (let j = 0; j < items.length; j++) {
//                 list.push(items[j].toInfo());
//                 let sub_items = yield model.wxdemo2Point.find({parent_id: items[j].point_id});
//                 for (let k = 0; k < sub_items.length; k++) {
//                     list.push(sub_items[k].toInfo());
//                 }
//             }
//         }
//         return list;
//     }
// });























