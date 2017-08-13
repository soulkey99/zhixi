/**
 * Created by MengLei on 2016-08-26.
 */
"use strict";
global.model = require('./../model');

module.exports = {
    Student: require('./user/student'),
    Teacher: require('./user/teacher'),
    Parent: require('./user/parent'),
    User: require('./user/user'),
    UserSession: require('./user/session'),
    School: require('./school/school'),
    Log: require('./other/log'),
    Task: require('./other/task'),
    Msg: require('./user/msg'),
    WXMsg: require('./other/wxhook'),
    SysConfig: require('./other/config'),
    Study: require('./school/study'),
    StudyQuestion: require('./study/question'),
    StudyPoint: require('./study/point'),
    StudyExercise: require('./study/exercise'),
    StudyCatalog: require('./study/catalog'),
    StudyVersion: require('./study/version'),
    wxDemo1: require('./wxdemo/demo1'),
    wxDemo2: require('./wxdemo/demo2')
};

