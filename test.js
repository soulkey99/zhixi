/**
 * Created by MengLei on 2016-09-12.
 */
"use strict";
let c = {
    startAt: new Date('2016-11-04'),
    endAt: new Date('2016-12-01'),
    week: 'every',
    duration: 90,
    hour: 3,
    noon: 'after',
    minute: 30,
    week_num: ['1', '2', '3', '4']
};
let t1 = new Date(c.startAt);   //开始日期
let t2 = new Date(Date.now() + 27 * 24 * 60 * 60 * 1000);     //截止日期
t1.setHours(0, 0, 0, 0);
let t0 = new Date(t1);
t2.setHours(23, 59, 59, 999);
console.log(t2.toLocaleString());
let seq = 1;    //课时序号
for (; t1 < t2; t1.setDate(t1.getDate() + 1)) {
    if (c.week == 'double' && Math.floor((t1 - t0) / 86400 / 7 / 1000) % 2 == 1) {
        continue;   //对于双周排课的情况要特殊处理
    }
    if (c.week_num.indexOf(t1.getDay().toString()) >= 0) {
        let schedule = {};
        schedule.seq = seq;
        seq++;
        let time = new Date(t1);
        time.setHours(c.hour + (c.noon == 'after' ? 12 : 0), c.minute);
        schedule.startAt = time;
        schedule.duration = c.duration;
        schedule.endAt = new Date(schedule.startAt.getTime() + c.duration * 60 * 1000);
        console.log(`seq: ${schedule.seq}, start: ${schedule.startAt.toLocaleString()}, end: ${schedule.endAt.toLocaleString()}, day: ${schedule.startAt.getDay()}`);
    }
}
