/**
 * Created by MengLei on 2016-12-01.
 */
"use strict";

const mongoose = require('mongoose');
const BaseModel = require('../baseModel');
const Schema = mongoose.Schema;

let HignSchoolSchema = new Schema({   //高中的数据
    _id: {type: Schema.Types.ObjectId},
    name: {type: String, required: true},    //校名
    desc: {type: String, default: ''},    //学校介绍
    point: {type: Number, required: true},   //录取分数
    code: {type: String, required: true},    //代码
    main_subject_point: {type: Number, required: true},  //语数外三科总分
    math_point: {type: Number, required: true},   //数学分数
    language_point: {type: Number, required: true},   //语文分数
    key: {type: [String], default: []},    //搜索关键字
    level: {type: Number, required: true}  //学校分级，1级(大于720)、2级(720至700)、3级(低于700)
}, {timestamps: 1, id: false});

let JuniorSchoolSchema = new Schema({   //初中的数据
    _id: {type: Schema.Types.ObjectId},
    name: {type: String, required: true},
    key: {type: [String], default: []},
    userID: {type: Schema.Types.ObjectId}
}, {timestamps: 1, id: false});

let UserFillSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    userID: {type: Schema.Types.ObjectId, required: true},
    school_id: {type: Schema.Types.ObjectId, required: true},
    school_name: {type: String, required: true},
    rank: {type: Number, required: true},
    math_point: {type: Number, required: true},
    target_id: {type: Schema.Types.ObjectId, required: true},
    target_name: {type: String, required: true}
}, {timestamps: 1, id: false});

//问题和选项都使用一个html片段来进行格式化展示，这样可以保证图文混排的展示方式比较简单
let ChoiceSchema = new Schema({
    content: {type: String, default: ''},   //选项内容
    action: {type: String, default: ''},  //选项类型（next：下一题，question：提示审题，hint：弹hint字段，result：到结果页）
    correct: {type: Boolean},   //是否正确答案
    flag: {type: String, default: ''},  //标识
    hint: {type: String, default: ''},  //提示
    next: {type: Schema.Types.ObjectId}   //下一题id
});

let QuestionSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    root_id: {type: Schema.Types.ObjectId}, //如果是过程或者结论，那么它属于的题干的id，题干没有此字段
    next: {type: Schema.Types.ObjectId},    //如果是根，那么下一步要进行的题目id
    type: {type: String, default: 'root'}, //类型，question普通选择题，root分步式题干，step分步式解题步骤
    content: {type: String, default: ''},  //内容
    choice: {type: [ChoiceSchema], default: []},    //选项
    point: {type: [Schema.Types.Mixed], default: []},     //相关知识点list
    skill: {type: [Schema.Types.Mixed], default: []},       //考察技能list
    difficulty: {type: Number, default: 1},     //题目难度
    score: {type: Number, default: 0},  //题目分数
    shortestPath: {type: [Schema.Types.ObjectId], default: []},   //最短路径，仅root有
    remark: {type: String, default: ''}     //备注
}, {timestamps: 1, read: 'sp', id: false});

let StepSchema = new Schema({
    q_id: {type: Schema.Types.ObjectId},
    correct: {type: Boolean},
    choice_id: {type: Schema.Types.ObjectId},
    t: {type: Date}
}, {timestamps: {createdAt: 't', updatedAt: 't'}});

let ExerciseSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    userID: {type: Schema.Types.ObjectId, required: true},
    group: {type: String, default: 'a'},    //测试组，分步答疑错误时，a：可以向下执行，b：不可以向下执行
    questions: {type: [Schema.Types.ObjectId], default: []}, //本次练习需要作答的题目列表
    status: {type: String, default: 'pending'},
    point: {type: Number, default: 0}
}, {timestamps: 1, read: 'sp', id: false});

let EStoreSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    num: {type: Number, required: true},
    questions: {type: [Schema.Types.ObjectId]},
    valid: {type: Boolean, default: true}
}, {timestamps: 1, read: 'sp', id: false});

let EStepSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    userID: {type: Schema.Types.ObjectId, required: true},
    e_id: {type: Schema.Types.ObjectId, required: true},
    q_id: {type: Schema.Types.ObjectId, required: true},
    type: {type: String, required: true},
    choice_id: {type: Schema.Types.ObjectId},
    correct: {type: Boolean},
    steps: {type: [StepSchema], default: []},
}, {timestamps: 1, read: 'sp', id: false});

let SkillSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    content: {type: String, default: ''},
    remark: {type: String, default: ''},
    level1: {type: String, default: ''},  //以下是6个等级的掌握度 A+
    level2: {type: String, default: ''},  //A
    level3: {type: String, default: ''},  //B
    level4: {type: String, default: ''},  //C
    level5: {type: String, default: ''},  //D
    level6: {type: String, default: ''},
    rate1: {type: Number, default: 0},   //以下是各个等级的掌握度 一类
    rate2: {type: Number, default: 0},   //二类
    rate3: {type: Number, default: 0},   //三类
    rate4: {type: Number, default: 0},   //C
    rate5: {type: Number, default: 0},   //D
    rate6: {type: Number, default: 0}
}, {timestamps: 1, read: 'sp', id: false});

let PointSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    content: {type: String, default: ''},
    remark: {type: String, default: ''},
    level1: {type: String, default: ''},  //以下是6个等级的掌握度A+
    level2: {type: String, default: ''},  //A
    level3: {type: String, default: ''},  //B
    level4: {type: String, default: ''},  //C
    level5: {type: String, default: ''},  //D
    level6: {type: String, default: ''},
    rate1: {type: Number, default: 0},   //以下是各个等级的掌握度 一类
    rate2: {type: Number, default: 0},   //二类
    rate3: {type: Number, default: 0},   //三类
    rate4: {type: Number, default: 0},   //C
    rate5: {type: Number, default: 0},   //D
    rate6: {type: Number, default: 0}
}, {timestamps: 1, read: 'sp', id: false});

let ScoreListSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    userID: {type: Schema.Types.ObjectId},
    point: {type: Number, required: true}
}, {timestamps: 1, read: 'sp', id: false});

let EScoreListSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    userID: {type: Schema.Types.ObjectId, required: true},
    e_id: {type: Schema.Types.ObjectId, required: true},
    year: {type: String, default: '2016'},
    point: {type: Number, required: true}
}, {timestamps: 1, read: 'sp', id: false});

HignSchoolSchema.plugin(BaseModel);
JuniorSchoolSchema.plugin(BaseModel);
UserFillSchema.plugin(BaseModel);
QuestionSchema.plugin(BaseModel);
ExerciseSchema.plugin(BaseModel);
EStoreSchema.plugin(BaseModel);
EStepSchema.plugin(BaseModel);
SkillSchema.plugin(BaseModel);
PointSchema.plugin(BaseModel);
ScoreListSchema.plugin(BaseModel);
EScoreListSchema.plugin(BaseModel);

HignSchoolSchema.virtual('school_id').get(function () {
    return this._id.toString();
});

JuniorSchoolSchema.virtual('school_id').get(function () {
    return this._id.toString();
});

UserFillSchema.virtual('fill_id').get(function () {
    return this._id.toString();
});

QuestionSchema.virtual('q_id').get(function () {
    return this._id.toString();
});

ExerciseSchema.virtual('e_id').get(function () {
    return this._id.toString();
});

EStoreSchema.virtual('est_id').get(function () {
    return this._id.toString();
});

EStepSchema.virtual('es_id').get(function () {
    return this._id.toString();
});

SkillSchema.virtual('skill_id').get(function () {
    return this._id.toString();
});

PointSchema.virtual('point_id').get(function () {
    return this._id.toString();
});

HignSchoolSchema.method('toInfo', function () {
    return {
        school_id: this.school_id,
        name: this.name,
        point: this.point,
        math_point: this.math_point,
        level: this.level
    }
});

HignSchoolSchema.method('toSimpleInfo', function () {
    return {
        school_id: this.school_id,
        name: this.name
    }
});

JuniorSchoolSchema.method('toInfo', function () {
    return {
        school_id: this.school_id,
        name: this.name
    }
});

UserFillSchema.method('toInfo', function () {
    return {
        fill_id: this.fill_id,
        school_id: this.school_id,
        school_name: this.school_name,
        math_point: this.math_point,
        target_id: this.target_id,
        target_name: this.target_name,
        createdAt: this.createdAt
    }
});

SkillSchema.method('toInfo', function () {
    return {
        skill_id: this.skill_id,
        content: this.content,
        remark: this.remark,
    }
});

PointSchema.method('toInfo', function () {
    return {
        point_id: this.point_id,
        content: this.content,
        remark: this.remark,
    }
});

QuestionSchema.method('toInfo', function () {
    let info = {
        q_id: this.q_id,
        type: this.type,
        content: this.content,
        score: this.score,
        remark: this.remark
    };
    if (info.type == 'root') {
        info.stage = this.stage;
        info.subject = this.subject;
        info.grade = this.grade;
        info.next = this.next;
        info.difficulty = this.difficulty;
        info.shortestPath = this.shortestPath || undefined;
    } else {
        info.root_id = this.root_id;
        info.choice = [];
        info.next = this.next;
        for (let i = 0; i < this.choice.length; i++) {
            info.choice.push({
                action: this.choice[i].action,
                choice_id: this.choice[i]._id,
                content: this.choice[i].content,
                correct: this.choice[i].correct,
                flag: this.choice[i].flag,
                hint: this.choice[i].hint,
            });
        }
    }
    return info;
});


mongoose.model('wxdemoHighSchool', HignSchoolSchema, 'wxdemoHighSchool');
mongoose.model('wxdemoJuniorSchool', JuniorSchoolSchema, 'wxdemoJuniorSchool');
mongoose.model('wxdemoUserFillInfo', UserFillSchema, 'wxdemoUserFillInfo');
mongoose.model('wxdemoQuestion', QuestionSchema, 'wxdemoQuestion');
mongoose.model('wxdemoExercise', ExerciseSchema, 'wxdemoExercise');
mongoose.model('wxdemoEStore', EStoreSchema, 'wxdemoEStore');
mongoose.model('wxdemoEStep', EStepSchema, 'wxdemoEStep');
mongoose.model('wxdemoScore', ScoreListSchema, 'wxdemoScore');
mongoose.model('wxdemoSkill', SkillSchema, 'wxdemoSkill');
mongoose.model('wxdemoPoint', PointSchema, 'wxdemoPoint');
mongoose.model('wxdemoEScore', EScoreListSchema, 'wxdemoEScore');


