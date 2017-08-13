/**
 * Created by MengLei on 2016-08-26.
 */
"use strict";
const Router = require('koa-router');
const smsUtil = require('../../utils/sms');
const auth = require('./../utils/oauth');
const user = require('./user');
const student = require('./student');
const teacher = require('./teacher');
const parent = require('./parent');
const mqtt = require('./mqtt');
const geodata = require('./geodata');
const other = require('./other');
const study = require('./study');
const weixin = require('./weixin');
const wxdemo = require('./demo/wxdemo');
const wxdemo2 = require('./demo/wxdemo2');

let router = {
    get: function () {
        exec('get', arguments);
    },
    post: function () {
        exec('post', arguments);
    },
    put: function () {
        exec('put', arguments);
    },
    del: function () {
        exec('del', arguments);
    }
};
let restRouter = new Router();
let webRouter = new Router();
function exec(method, args) {   //execute both route
    switch (args.length) {
        case 2: {
            restRouter[method](args[0], args[1]);
            webRouter[method](args[0], args[1]);
        }
            break;
        case 3: {
            restRouter[method](args[0], args[1], args[2]);
            webRouter[method](args[0], args[1], args[2]);
        }
            break;
        case 4: {
            restRouter[method](args[0], args[1], args[2], args[3]);
            webRouter[method](args[0], args[1], args[2], args[3]);
        }
            break;
        case 5: {
            restRouter[method](args[0], args[1], args[2], args[3], args[4]);
            webRouter[method](args[0], args[1], args[2], args[3], args[4]);
        }
            break;
        default:
            throw(new Error('router exception.'));
            break;
    }
}

//用户部分
router.post('/:userType/smscode', smsUtil.get);   //获取短信验证码
router.post('/:userType/login', user.checkLogin, user.doLogin);   //普通登陆
// router.post(' /autoLogin', user.checkSession, user.doLogin);   //自动登陆
router.post('/:userType/ssoLogin', user.checkSSO, user.doLogin); //sso登陆
router.post('/:userType/guestLogin', user.guestReg, user.doRegister, user.doLogin);    //游客登陆
router.post('/:userType/register', user.checkReg, user.doRegister, user.doLogin); //普通注册
router.post('/:userType/logout', user.checkToken, user.doLogout);  //用户注销
router.post('/:userType/resetPwd', smsUtil.middle, user.resetPwd);  //用户重置密码
router.post('/:userType/changePwd', auth.required, user.stateUser, user.changePwd); //用户修改密码
router.get('/:userType/checkToken', user.checkToken, user.getExpireInfo);    //获取accessToken或者refreshToken的信息
router.post('/:userType/accessToken', user.checkToken, user.doRefreshAccessToken);    //刷新accessToken
router.post('/:userType/refreshToken', user.checkToken, user.doRefreshRefreshToken);    //刷新refreshToken
router.post('/:userType/checkphone', auth.required, user.stateUser, user.checkPhone); //校验填写的手机号是否正确
router.post('/:userType/checksms', auth.required, user.stateUser, user.checkSMS);    //校验短信验证码
router.get('/:userType/info', auth.required, user.getInfo);  //获取个人信息
router.post('/:userType/info', auth.required, user.setInfo);  //修改个人信息
router.get('/:userType/msgbox', auth.required, user.getMsgBox); //获取消息
router.get('/:userType/msg/:msg_id', auth.required, user.getMsgDetail); //获取消息详情


router.get('/:userType/teacher/:userID/info', auth.optional, user.teacherInfo);   //获取教师的信息
router.get('/:userType/student/:userID/info', auth.optional, user.studentInfo);   //获取学生的信息
router.get('/:userType/parent/:userID/info', auth.optional, user.parentInfo);     //获取家长的信息

//教师相关
router.get('/t/todoList', auth.required, teacher.getTodoList);  //获取教师端首页待办事项
router.get('/t/class', auth.required, teacher.getMyClass);    //获取教师名下所有班级列表
router.post('/t/school', auth.required, teacher.createSchool);    //创建学校
router.post('/t/school/:school_id', auth.required, teacher.editSchool);   //编辑学校信息
router.post('/t/school/:school_id/class', auth.required, teacher.createClass);    //创建班级
router.post('/t/school/:school_id/class/:class_id', auth.required, teacher.editClass);    //编辑班级信息
router.post('/t/class/:class_id', auth.required, teacher.editClass);      //编辑班级信息
router.post('/t/class/:class_id/student/add', auth.required, teacher.classAddStudent);      //编辑班级信息
router.get('/t/class/:class_id/student', auth.required, teacher.getClassStudent); //获取班级学生列表
router.get('/t/class/:class_id', auth.required, teacher.getClassDetail);     //获取班级详情
router.post('/t/class/:class_id/student/del', auth.required, teacher.classRemoveStudent);      //删除班级学生
router.get('/t/class/:class_id/schedule', auth.required, teacher.getSchedule);        //教师获取指定班级的课时计划
router.post('/t/class/:class_id/schedule/:schedule_id', auth.required, teacher.editSchedule);  //教师编辑课时计划
router.post('/t/schedule/:schedule_id', auth.required, teacher.editSchedule);  //教师编辑课时计划
router.get('/t/question', auth.required, teacher.getHomeworkQList);        //教师留作业抽题
router.get('/t/homework', auth.required, teacher.getMyHomework);    //获取教师曾经留过的作业列表
router.get('/t/class/:class_id/homework', auth.required, teacher.getMyHomework);    //教师获取指定班级曾经留过的作业列表
router.get('/t/schedule/:schedule_id/detail', auth.required, teacher.getScheduleDetail);    //教师获取课时详情
router.get('/t/schedule/:schedule_id/homework', auth.required, teacher.getScheduleHomework);    //教师获取作业题目列表
router.post('/t/schedule/:schedule_id/homework', auth.required, teacher.createHomework);    //教师留作业
router.post('/t/schedule/:schedule_id/student/:s_id/homework', auth.required, teacher.assignAdditionHomework);  //指定课时给指定学生单独留作业
router.post('/t/schedule/:schedule_id/homework/update', auth.required, teacher.updateHomework);   //发布作业草稿
router.post('/t/schedule/:schedule_id/homework/publish', auth.required, teacher.publishHomework);   //教师发布草稿状态的作业
router.get('/t/schedule/:schedule_id/sworkList', auth.required, teacher.getStudentHomeworkList);    //教师获取学生收到的作业列表
router.get('/t/schedule/:schedule_id/homework/stat', auth.required, teacher.getHomeworkStat);   //教师获取指定课时的作业统计结果
router.get('/t/schedule/:schedule_id/homework/stat/unfinished', auth.required, teacher.getHomeworkStatUnfinished);    //教师获取指定课时作业未完成学生列表
router.get('/t/schedule/:schedule_id/homework/stat/question', auth.required, teacher.getHomeworkStatQuestions); //教师获取制定作业的错题列表
router.get('/t/schedule/:schedule_id/homework/stat/student', auth.required, teacher.getHomeworkStatStudentList);    //教师获取指定作业的学生掌握情况列表
router.get('/t/schedule/:schedule_id/homework/stat/student/:s_id', auth.required, teacher.getHomeworkStatStudentDetail);  //教师获取指定课时作业指定学生的情况详情
router.get('/t/schedule/:schedule_id/student/:s_id/feedback', auth.required, teacher.getStudentHomeworkFeedback);  //教师获取对应课时给学生的历史反馈
router.post('/t/schedule/:schedule_id/student/:s_id/feedback', auth.required, teacher.addStudentHomeworkFeedback);  //教师获取对应课时给学生的历史反馈
router.get('/t/swork/:swork_id/stat', auth.required, teacher.getSworkStatStudentDetail);    //获取指定学生端作业记录的答题统计详情
router.get('/t/swork/:swork_id/question/:q_id/steps', auth.required, teacher.getSworkQuestionSteps);   //获取指定学生作业的指定题目答题流程
router.get('/t/schedule/:schedule_id/homework/stat/question/:q_id/wrong', auth.required, teacher.getHomeworkStatQuestionWrongStudent);  //教师获取指定课时作业指定题目答错学生列表
router.get('/t/search/student', auth.required, teacher.searchStudent);        //教师搜索学生
router.get('/t/classJoinList', auth.required, teacher.getClassJoinList);    //教师获取加班级列表
router.get('/t/class/:class_id/joinList', auth.required, teacher.getClassJoinList); //教师获取指定班级的申请列表
router.post('/t/classJoin/:cs_id', auth.required, teacher.checkJoin);   //教师审核学生的班申请
router.get('/t/feedbackTemplateList', auth.required, teacher.getFeedbackTemplate);  //教师的反馈模板列表


//学生相关1
router.get('/s/recentList', auth.required, student.getRecentList);  //学生获取最近列表
router.get('/s/class', auth.required, student.getMyClass);    //获取学生名下的所有班级列表
router.get('/s/search/class', auth.required, student.searchClass);  //搜索班级
router.get('/s/class/:class_id', auth.required, student.classDetail);   //学生获取班级详情
router.post('/s/class/:class_id/join', auth.required, student.joinClass);       //学生申请加入班级
router.get('/s/classJoinHistory', auth.required, student.getJoinClassHistory);  //申请加入班级的历史
router.get('/s/class/:class_id/homework', auth.required, student.getHomework);  //学生获取班级作业列表
router.get('/s/homework', auth.required, student.getHomework);    //学生获取作业列表
router.get('/s/homework/:swork_id', auth.required, student.getHomeworkDetailList);   //学生获取指定作业的题目列表
router.get('/s/homework/:swork_id/detail', auth.required, student.getSworkDetail);   //学生获取指定作业的详情
router.get('/s/homework/:swork_id/next', auth.required, student.getSworkNext);      //学生获取作业下一道未答题目
router.get('/s/homework/:swork_id/question/:q_id', auth.required, student.getHomeworkQuestion); //学生端获取指定作业指定题目详情
router.post('/s/homework/:swork_id/question/:q_id/check', auth.required, student.checkHomeworkQuestion);    //学生端做作业
router.get('/s/homework/:swork_id/question/:q_id/review', auth.required, student.getHomeworkReview);    //学生端获取作业回顾
router.get('/s/homework/:swork_id/question/:q_id/result', auth.required, student.getHomeworkResult);    //学生端获取作业结果
router.get('/s/homework/:swork_id/question/:q_id/steps', auth.required, student.getHomeworkQuestionStep);  //学生获取指定作业题目的答题步骤
router.get('/s/wrongList', auth.required, student.getWrongList);    //学生端获取错题列表
router.get('/s/parents', auth.required, student.getParentList);     //获取家长列表
router.post('/s/parent/:p_id/unbind', auth.required, student.removeParent);  //学生解除家长的绑定
router.get('/s/stat', auth.required, student.getStat);   //学生获取自己的统计信息

//家长相关
router.get('/p/student/:s_id/info', auth.required, parent.getStuInfo);    //家长获取学生信息
router.post('/p/student/:s_id/bind', auth.required, parent.bindStudent);  //家长绑定学生
router.get('/p/bind', auth.required, parent.getBindedStudent);    //家长查看绑定学生列表
router.get('/p/homework/:swork_id', auth.required, parent.getStudentHomework);


//分步式答题部分
router.get('/:userType/vgList', study.getVersionGrade);     //获取版本与年级列表
router.get('/:userType/study/catalog', study.getCatalog);   //获取教材目录
router.get('/:userType/study/detail', study.getMaterialDetail);   //获取教材详情
router.get('/:userType/study/section/:sec_id/question', study.getSectionQuestion);  //获取小节下的问题列表
router.get('/:userType/study/section/:sec_id/nextSection', auth.required, study.getNextSection);   //获取下一小节
router.get('/:userType/study/section/:sec_id/next', auth.required, study.getSectionNext);   //获取小节下一道没有答过的题目
router.get('/:userType/study/question/:q_id', study.getStudyQuestion); //获取学习题目
router.get('/:userType/study/question/:q_id/shortestPath', study.getShortestPath);  //获取题目最短路径
router.get('/:userType/study/question/:q_id/exercise', auth.required, study.getQuestionExercise);   //获取问题做过的练习列表
router.get('/:userType/study/questions', study.getQuestionsByID);        //根据ID参数返回一个题目数组
// router.post('/:userType/study/question/:q_id/check', auth.required, study.checkQuestion);   //答题
router.get('/:userType/study/books', study.getExerciseBooks);    //获取练习册列表
router.get('/:userType/study/version/:ver_id/catalog', study.getVersionCatalog);     //根据ver_id获取教材目录信息
router.get('/:userType/study/version/:ver_id/detail', study.getVersionDetail);      //根据ver_id获取教材详情
router.get('/:userType/study/version/:ver_id/process', auth.required, study.getVersionProcess); //根据ver_id获取教材、练习册的答题进度
router.post('/:userType/study/exercise', auth.required, study.newExercise); //开始一个新的练习
router.post('/:userType/study/exercise/:e_id/check', auth.required, study.checkExercise); //练习进行答题
router.get('/:userType/study/exercise/:e_id/result', auth.required, study.exercisePoint);    //获取练习的分数
router.get('/:userType/study/exercise/:e_id/review', auth.required, study.getExerciseReview); //获取练习回顾
router.get('/:userType/study/exercise/:e_id/steps', auth.required, study.getExerciseSteps); //获取练习全部步骤


//--------------------------------------------
router.get('/:userType/study/gsList', study.getGradeSubject); //获取学段年级科目列表
router.get('/:userType/study/exercise', auth.required, study.getExerciseList);    //获取练习列表
router.get('/:userType/study/question/:q_id/extra', auth.required, study.getStudyQuestionExtra);  //获取问题附加信息列表
router.get('/:userType/study/exercise/:e_id/result', auth.required, study.getExerciseResult);    //获取练习结果
router.get('/:userType/study/exercise/:e_id/detail', auth.required, study.getExerciseDetail); //获取练习记录详情
router.post('/:userType/study/exercise/:e_id/cancel', auth.required, study.cancelExercise);   //关闭一个练习
router.get('/:userType/study/versions', study.getVersionList);    //获取教材版本列表
// router.get('/:userType/study/section/:sec_id/questions', auth.required, study.getSectionQuestion);    //获取节下面的问题列表
router.get('/:userType/study/checkPending', auth.required, study.getPending);   //检查某道题是否有未完成的练习


//地理位置相关
router.get('/:userType/geodata/nearby', auth.optional, geodata.nearby);   //周边检索
router.get('/:userType/geodata/local', auth.optional, geodata.local);     //本地检索
router.get('/:userType/geodata/ip', auth.optional, geodata.ip);  //ip定位
//其他接口
router.get('/:userType/nearby', auth.required, other.nearby);
//mqtt部分
router.post('/:userType/mqtt/superuser', mqtt.superuser); //超级用户校验
router.post('/:userType/mqtt/auth', mqtt.auth);   //普通用户校验
router.post('/:userType/mqtt/acl', mqtt.acl);     //access control

//微信web端需要接口
router.get('/:userType/wx_hook', weixin.echo);
router.post('/:userType/wx_hook', weixin.webhook);
router.get('/:userType/wx/oauth', weixin.oauth, user.checkSSO, user.doLogin);    //微信oauth登录
router.get('/:userType/wx/js_config', weixin.js_config);
router.get('/:userType/wx/redirect', weixin.redirect);

//微信demo接口
router.get('/s/wxdemo/juniorList', wxdemo.getJuniorSchoolList);   //获取初中列表
router.get('/s/wxdemo/highList', wxdemo.getHighSchoolList);    //获取高中列表
router.post('/s/wxdemo/juniorSchool', auth.required, wxdemo.addJuniorSchoolItem);   //添加初中
router.post('/s/wxdemo/info', auth.required, wxdemo.userFillInfo);     //填写信息
router.get('/s/wxdemo/shortReport', auth.required, wxdemo.getShortReport);   //获取小报告
router.post('/s/wxdemo/exercise', auth.required, wxdemo.genExercise);    //新建一个练习
router.get('/s/wxdemo/exercise/:e_id/next', auth.required, wxdemo.getNextQuestion);   //获取练习下一道题
router.get('/s/wxdemo/question/:q_id', wxdemo.getQuestion);     //根据ID获取题目
router.post('/s/wxdemo/exercise/:e_id/check', auth.required, wxdemo.qCheck);    //答题
router.get('/s/wxdemo/exercise/:e_id/report', auth.required, wxdemo.getMyReport);    //获取最后的报告

//微信demo2接口
router.post('/s/wxdemo2/info', auth.required, wxdemo2.userFillInfo);    //用户填写个人信息
router.get('/s/wxdemo2/shortReport', auth.required, wxdemo2.getShortReport);   //获取小报告
router.post('/s/wxdemo2/exercise', auth.required, wxdemo2.genExercise);    //新建一个练习
router.get('/s/wxdemo2/exercise/next', auth.required, wxdemo2.getNextQuestion);   //获取练习下一道题
router.get('/s/wxdemo2/exercise/:e_id/next', auth.required, wxdemo2.getNextQuestion);
router.get('/s/wxdemo2/question/:q_id', wxdemo2.getQuestion);   //根据问题ID获取问题
router.post('/s/wxdemo2/exercise/:e_id/check', auth.required, wxdemo2.qCheck);    //学生答题
router.get('/s/wxdemo2/exercise/:e_id/info', auth.required, wxdemo2.getUserExerciseInfo);  //学生获取练习信息
//router.get('/s/wxdemo2/report/cover', auth.optional, wxdemo2.getReportCover);   //获取报告封面
router.get('/s/wxdemo2/exercise/:e_id/cover', auth.required, wxdemo2.getReportCover);
//router.get('/s/wxdemo2/report/paperAnalysis', wxdemo2.getPaperAnalysis);  //获取试卷分析
router.get('/s/wxdemo2/exercise/:e_id/paperAnalysis', auth.required, wxdemo2.getPaperAnalysis);
//router.get('/s/wxdemo2/report/resultAnalysis', wxdemo2.getResultAnalysis);   //获取成绩分析
router.get('/s/wxdemo2/exercise/:e_id/resultAnalysis', auth.required, wxdemo2.getResultAnalysis);
//router.get('/s/wxdemo2/report/rankAnalysis', wxdemo2.getRankAnalysis);   //获取排名分析
router.get('/s/wxdemo2/exercise/:e_id/rankAnalysis', auth.required, wxdemo2.getRankAnalysis);
//router.get('/s/wxdemo2/report/skillAnalysis', wxdemo2.getSkillAnalysis);   //能力雷达
router.get('/s/wxdemo2/exercise/:e_id/skillAnalysis', auth.required, wxdemo2.getSkillAnalysis);
//router.get('/s/wxdemo2/report/pointAnalysis', wxdemo2.getPointAnalysis);  //获取知识点分布
router.get('/s/wxdemo2/exercise/:e_id/pointAnalysis', auth.required, wxdemo2.getPointAnalysis);
//router.get('/s/wxdemo2/report/improveStrategy', wxdemo2.getImproveStrategy);  //提分策略
router.get('/s/wxdemo2/exercise/:e_id/improveStrategy', auth.required, wxdemo2.getImproveStrategy);
//router.get('/s/wxdemo2/report/pointGraph', wxdemo2.getPointGraph);   //知识点图谱
router.get('/s/wxdemo2/exercise/:e_id/pointGraph', auth.required, wxdemo2.getPointGraph);
router.get('/s/wxdemo2/config', wxdemo2.getConfig);     //获取配置信息
router.post('/s/wxdemo2/config', wxdemo2.editConfig);    //修改配置信息


// module.exports = router;
module.exports = {
    restRouter: restRouter,
    webRouter: webRouter
};

function* rt(next) {
    if (this.params.userType != 's') {
        return yield next;
    }
}
