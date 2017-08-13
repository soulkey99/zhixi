/**
 * Created by MengLei on 2016-10-08.
 */
"use strict";
const CronJob = require('cron').CronJob;
const proxy = require('../../common/proxy');

if (!process.env.NODE_ENV) {
    return;
}
new CronJob('0 * * * * *', proxy.Task.auto_publish_homework, null, true);   //定时任务，每分钟运行一次，自动发布作业，设定作业超时
// new CronJob('0 * * * * *', proxy.Task.auto_stat_homework, null, true);   //定时任务，每分钟运行一次，自动统计作业完成信息
new CronJob('0 * * * * *', proxy.Task.auto_timeout_homework, null, true);   //定时任务，每分钟运行一次，自动将作业置为超时状态
new CronJob('0 0 3 * * *', proxy.Task.todo_task, null, true, null, null, false);       //定时任务，每天凌晨三点运行，维护教师的todo列表
new CronJob('0 30 3 * * *', proxy.Task.student_stat_task, null, true, null, null, false);   //定时任务，每天凌晨三点半，统计学生端的答题数据
