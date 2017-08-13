/**
 * Created by MengLei on 2016-12-21.
 */
"use strict";
const mongoose = require('mongoose');
const BaseModel = require('../baseModel');
const Schema = mongoose.Schema;

//用户填写的个人信息
let UserFillSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    userID: {type: Schema.Types.ObjectId, required: true},
    school_id: {type: Schema.Types.ObjectId, required: true},
    school_name: {type: String, required: true},
    rank: {type: Number, required: true},
    math_point: {type: Number, required: true},
    main_point: {type: Number, required: true},
    target_id: {type: Schema.Types.ObjectId, required: true},
    target_name: {type: String, required: true}
}, {timestamps: 1, id: false});

//问题和选项都使用一个html片段来进行格式化展示，这样可以保证图文混排的展示方式比较简单
let ChoiceSchema = new Schema({
    content: {type: String, default: ''},   //选项内容
    action: {type: String, default: ''},  //选项类型（next：下一题，question：提示审题，hint：弹hint字段，result：到结果页）
    correct: {type: Boolean, default: false},   //是否正确答案
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
    point: {type: [Schema.Types.ObjectId], default: []},     //相关知识点list
    skill: {type: [Schema.Types.ObjectId], default: []},       //考察技能list
    difficulty: {type: Number, default: 1},     //题目难度
    score: {type: Number, default: 0},  //题目分数
    shortestPath: {type: [Schema.Types.ObjectId], default: []},   //最短路径，仅root有
    remark: {type: String, default: ''}     //备注
}, {timestamps: 1, read: 'sp', id: false});

//题库
let EStoreSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    num: {type: Number, required: true},
    subject: {type: String, default: '数学'},
    questions: {type: [Schema.Types.ObjectId], default: [], required: true},
    total_point: {type: Number},
    score: {type: Number},
    coverage: {type: Number},
    difficulty: {type: Number, required: true},
    valid: {type: Boolean, default: true}
}, {timestamps: 1, read: 'sp', id: false});

//知识点
let PointSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    //类型：point：一级知识点，sub_point：二级知识点，item：三级知识点，sub_item：四级知识点
    type: {type: String, enum: ['point', 'sub_point', 'item', 'sub_item'], required: true},
    content: {type: String, required: true},
    remark: {type: String, default: ''},
    parent_id: {type: Schema.Types.ObjectId},    //上级ID
    root_id: {type: Schema.Types.ObjectId},   //一级知识点ID
    sub_id: {type: Schema.Types.ObjectId},    //二级知识点ID
    group: {type: String},
    difficulty: {type: Number},   //难度
    exam_score: {type: Number},   //中考分值
    seq: {type: Number, default: 1}
}, {timestamps: 1, id: false});

//一次练习
let ResultSchema = new Schema({
    difficulty: {type: Number, default: 0},
    quantity: {type: Number, default: 0},
    score: {type: Number, default: 0},
    correct: {type: Number, default: 0}
}, {_id: false});
let PointItemSchema = new Schema({
    point_id: {type: String},
    type: {type: String},
    content: {type: String},
    remark: {type: String},
    parent_id: {type: String},
    group: {type: String},
    root_id: {type: String},
    sub_id: {type: String},
    seq: {type: Number},
    quantity: {type: Number},
    correct: {type: Number},
    total_score: {type: Number},
    difficulty: {type: Number},
    score: {type: Number},
    exam_score: {type: Number}
}, {_id: false});
let SkillItemSchema = new Schema({
    skill_id: {type: String},
    content: {type: String},
    remark: {type: String},
    quantity: {type: Number},
    correct: {type: Number},
    total_score: {type: Number},
    score: {type: Number},
    difficulty: {type: Number},
    current: {type: Number},
    suggest: {type: Number},
    time: {type: Number},
    key: {type: String}
}, {_id: false});
let ExerciseSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    userID: {type: Schema.Types.ObjectId, required: true},
    estore_id: {type: Schema.Types.ObjectId, required: true},
    group: {type: String, default: 'a'},    //测试组，分步答疑错误时，a：可以向下执行，b：不可以向下执行
    questions: {type: [Schema.Types.ObjectId], default: [], required: true}, //本次练习需要作答的题目列表
    status: {type: String, default: 'pending'},
    score: {type: Number, default: 0},
    list: {
        type: [ResultSchema],
        default: [
            {difficulty: 1, quantity: 0, score: 0, correct: 0},
            {difficulty: 2, quantity: 0, score: 0, correct: 0},
            {difficulty: 3, quantity: 0, score: 0, correct: 0},
            {difficulty: 4, quantity: 0, score: 0, correct: 0}
        ]
    },
    point_list: {type: [PointItemSchema], default: []},
    skill_list: {type: [SkillItemSchema], default: []}
}, {timestamps: 1, read: 'sp', id: false});

//能力项
let SkillSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    content: {type: String, default: ''},
    remark: {type: String, default: ''},
    difficulty: {type: Number},
    key1: {type: String},
    key2: {type: String},
    key3: {type: String},
    key4: {type: String}
}, {timestamps: 1, read: 'sp', id: false});

//练习中的步骤
let StepSchema = new Schema({
    q_id: {type: Schema.Types.ObjectId},
    correct: {type: Boolean},
    choice_id: {type: Schema.Types.ObjectId},
    t: {type: Date}
}, {timestamps: {createdAt: 't', updatedAt: 't'}});
let EStepSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    userID: {type: Schema.Types.ObjectId, required: true},
    e_id: {type: Schema.Types.ObjectId, required: true},
    q_id: {type: Schema.Types.ObjectId, required: true},
    type: {type: String, required: true},
    choice_id: {type: Schema.Types.ObjectId},
    correct: {type: Boolean},
    status: {type: String, default: 'pending'},
    steps: {type: [StepSchema], default: []},
}, {timestamps: 1, read: 'sp', id: false});

//
let ConfigSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    score1: {type: Number, required: true, default: 90},  //上等中等分界线
    score2: {type: Number, required: true, default: 60},  //中等与低等分界线
    key1: {type: String, required: true},
    key2: {type: String, required: true},
    key3: {type: String, required: true},
    key4: {type: String, required: true},
    key5: {type: String, required: true},
    key6: {type: String, required: true},
    key7: {type: String, required: true},
    key8: {type: String, required: true},
    key9: {type: String, required: true}
}, {timestamps: 1, read: 'sp', id: false});


UserFillSchema.plugin(BaseModel);
QuestionSchema.plugin(BaseModel);
EStoreSchema.plugin(BaseModel);
SkillSchema.plugin(BaseModel);
PointSchema.plugin(BaseModel);
ExerciseSchema.plugin(BaseModel);
EStepSchema.plugin(BaseModel);
ConfigSchema.plugin(BaseModel);


UserFillSchema.virtual('fill_id').get(function () {
    return this._id.toString();
});

QuestionSchema.virtual('q_id').get(function () {
    return this._id.toString();
});
EStoreSchema.virtual('estore_id').get(function () {
    return this._id.toString();
});
PointSchema.virtual('point_id').get(function () {
    return this._id.toString();
});
SkillSchema.virtual('skill_id').get(function () {
    return this._id.toString();
});
ExerciseSchema.virtual('e_id').get(function () {
    return this._id.toString();
});
EStoreSchema.virtual('es_id').get(function () {
    return this._id.toString();
});
ConfigSchema.virtual('config_id').get(function () {
    return this._id.toString();
});

EStoreSchema.pre('save', function *(next) {
    //
});

UserFillSchema.method('toInfo', function () {
    return {
        fill_id: this.fill_id,
        school_id: this.school_id,
        school_name: this.school_name,
        math_point: this.math_point,
        main_point: this.main_point,
        target_id: this.target_id,
        target_name: this.target_name,
        createdAt: this.createdAt
    }
});

ExerciseSchema.method('calculate', function *() {
    let steps = yield model.wxdemo2EStep.find({e_id: this.e_id});
    let e = this;
    e.list = [
        {difficulty: 1, quantity: 0, score: 0, correct: 0},
        {difficulty: 2, quantity: 0, score: 0, correct: 0},
        {difficulty: 3, quantity: 0, score: 0, correct: 0},
        {difficulty: 4, quantity: 0, score: 0, correct: 0}
    ];
    e.point_list = [];
    e.skill_list = [];
    e.score = 0;
    let point_obj = {};
    let skill_obj = {};
    for (let i = 0; i < steps.length; i++) {    //进行成绩分析，统计总得分以及各个难度题目的数量及得分情况
        let q = yield model.wxdemo2Question.findById(steps[i].q_id);
        for (let j = 0; j < e.list.length; j++) {
            if (q.difficulty == e.list[j].difficulty) {
                e.list[j].quantity++;
                e.list[j].score += q.score;
                if (steps[i].type == 'question') {
                    stat(q);
                    if (steps[i].correct) {
                        calc(q);
                        e.list[j].correct++;
                        e.score += q.score;
                    }
                } else if (steps[i].type == 'root') {
                    let correct = true;
                    for (let k = 0; k < steps[i].steps.length; k++) {
                        let stepq = yield model.wxdemo2Question.findById(steps[i].steps[k].q_id);
                        stat(stepq);
                        if (steps[i].steps[k].correct) {
                            calc(stepq);
                            e.score += stepq.score;
                        } else {
                            correct = false;
                        }
                    }
                    if (correct) {
                        e.list[j].correct++;
                    }
                }
            }
        }
    }
    function stat(q) {
        let points = q.point;
        let skills = q.skill;
        for (let i = 0; i < points.length; i++) {
            if (!point_obj[points[i].toString()]) {
                point_obj[points[i].toString()] = {quantity: 0, correct: 0, total_score: 0, score: 0};
            }
            point_obj[points[i].toString()].quantity++;
            point_obj[points[i].toString()].total_score += q.score;
        }
        for (let i = 0; i < skills.length; i++) {
            if (!skill_obj[skills[i].toString()]) {
                skill_obj[skills[i].toString()] = {quantity: 0, correct: 0, total_score: 0, score: 0};
            }
            skill_obj[skills[i].toString()].quantity++;
            skill_obj[skills[i].toString()].total_score += q.score;
        }
    }

    function calc(q) {
        let points = q.point;
        let skills = q.skill;
        for (let i = 0; i < points.length; i++) {
            if (!point_obj[points[i].toString()]) {
                point_obj[points[i].toString()] = {quantity: 0, correct: 0, total_score: 0, score: 0};
            }
            point_obj[points[i].toString()].correct++;
            point_obj[points[i].toString()].score += q.score;
        }
        for (let i = 0; i < skills.length; i++) {
            if (!skill_obj[skills[i].toString()]) {
                skill_obj[skills[i].toString()] = {quantity: 0, correct: 0, total_score: 0, score: 0};
            }
            skill_obj[skills[i].toString()].correct++;
            skill_obj[skills[i].toString()].score += q.score;
        }
    }

    let points = yield model.wxdemo2Point.find();
    let point_list = points.map(i => {
        let item = i.toInfo();
        item.quantity = 0;
        item.correct = 0;
        item.total_score = 0;
        item.score = 0;
        return item;
    });
    for (let i = 0; i < point_list.length; i++) {
        if (point_list[i].type == 'item') {
            if (point_obj[point_list[i].point_id]) {
                point_list[i].quantity = point_obj[point_list[i].point_id].quantity;
                point_list[i].correct = point_obj[point_list[i].point_id].correct;
                point_list[i].total_score = point_obj[point_list[i].point_id].total_score;
                point_list[i].score = point_obj[point_list[i].point_id].score;
            }
            for (let j = 0; j < point_list.length; j++) {
                if (point_list[i].root_id == point_list[j].point_id) {
                    point_list[j].quantity += point_list[i].quantity;
                    point_list[j].correct += point_list[i].correct;
                    point_list[j].total_score += point_list[i].total_score;
                    point_list[j].score += point_list[i].score;
                }
                if (point_list[i].sub_id == point_list[j].point_id) {
                    point_list[j].quantity += point_list[i].quantity;
                    point_list[j].correct += point_list[i].correct;
                    point_list[j].total_score += point_list[i].total_score;
                    point_list[j].score += point_list[i].score;
                }
            }
        }
    }
    e.point_list = point_list;
    let skills = yield model.wxdemo2Skill.find();
    let skill_list = skills.map(i => {
        let item = i.toInfo();
        item.quantity = 0;
        item.correct = 0;
        item.total_score = 0;
        item.score = 0;
        item.suggest = 0;
        item.time = 0;
        return item;
    });
    for (let i = 0; i < skill_list.length; i++) {
        if (skill_obj[skill_list[i].skill_id]) {
            skill_list[i].quantity = skill_obj[skill_list[i].skill_id].quantity;
            skill_list[i].correct = skill_obj[skill_list[i].skill_id].correct;
            skill_list[i].total_score = skill_obj[skill_list[i].skill_id].total_score;
            skill_list[i].score = skill_obj[skill_list[i].skill_id].score;
            if (skill_list[i].quantity != 0) {
                let current = Number.parseInt((skill_list[i].correct / skill_list[i].quantity * 100).toFixed(0));
                if (current > 80) {
                    skill_list[i].key = skill_list[i].key4;
                } else if (current > 60) {
                    skill_list[i].key = skill_list[i].key3;
                } else if (current > 40) {
                    skill_list[i].key = skill_list[i].key2;
                } else {
                    skill_list[i].key = skill_list[i].key1;
                }
                skill_list[i].suggest = current * (1 + skill_list[i].difficulty / 4);
                if (skill_list[i].suggest > 100) {
                    skill_list[i].suggest = 100;
                }
                skill_list[i].current = current;
                skill_list[i].time = skill_list[i].suggest - current;
            }
        }
    }
    e.skill_list = skill_list;
    return yield e.save();
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

PointSchema.method('toInfo', function () {
    let item = {
        point_id: this.point_id,
        type: this.type,
        content: this.content,
        remark: this.remark,
        group: this.group,
        parent_id: this.parent_id ? this.parent_id.toString() : '',
        root_id: this.root_id ? this.root_id.toString() : '',
        sub_id: this.sub_id ? this.sub_id.toString() : '',
        seq: this.seq
    };
    if (item.type == 'sub_point') {
        item.difficulty = this.difficulty;
        item.exam_score = this.exam_score;
    }
    return item;
});

SkillSchema.method('toInfo', function () {
    return {
        skill_id: this.skill_id,
        content: this.content,
        remark: this.remark,
        difficulty: this.difficulty,
        key1: this.key1,
        key2: this.key2,
        key3: this.key3,
        key4: this.key4
    }
});

PointSchema.method('toPoint', function *() {
    if (this.parent_id) {
        return yield getRoot(this.parent_id);
    } else {
        return this;
    }
    function *getRoot(id) {
        let p = yield model.wxdemo2Point.findById(id);
        if (p.parent_id) {
            return yield getRoot(p.parent_id);
        } else {
            return p;
        }
    }
});

PointSchema.method('toSubPoint', function *() {
    if (this.type == 'sub_point') {
        return this;
    } else {
        return yield getSubPoint(this.parent_id);
    }
    function *getSubPoint(id) {
        let p = yield model.wxdemo2Point.findById(id);
        if (p.type == 'sub_point') {
            return p;
        } else {
            return yield getSubPoint(p.parent_id);
        }
    }
});

PointSchema.method('toFullSubList', function *() {
    let sub_point = yield this.toSubPoint();
    return yield getFullSubList();
    function *getFullSubList() {
        let list = [];
        list.push(sub_point.toInfo());
        let items = yield model.wxdemo2Point.find({parent_id: sub_point.point_id});
        for (let j = 0; j < items.length; j++) {
            list.push(items[j].toInfo());
            let sub_items = yield model.wxdemo2Point.find({parent_id: items[j].point_id});
            for (let k = 0; k < sub_items.length; k++) {
                list.push(sub_items[k].toInfo());
            }
        }
        return list;
    }
});

PointSchema.method('toFullList', function *() {
    let root = yield this.toPoint();
    return yield getFullList(root.point_id);
    function *getFullList(root_id) {
        let list = [];
        let root = yield model.wxdemo2Point.findById(root_id);
        list.push(root.toInfo());
        let sub_points = yield model.wxdemo2Point.find({parent_id: root.point_id});
        for (let i = 0; i < sub_points.length; i++) {
            list.push(sub_points[i].toInfo());
            let items = yield model.wxdemo2Point.find({parent_id: sub_points[i].point_id});
            for (let j = 0; j < items.length; j++) {
                list.push(items[j].toInfo());
                let sub_items = yield model.wxdemo2Point.find({parent_id: items[j].point_id});
                for (let k = 0; k < sub_items.length; k++) {
                    list.push(sub_items[k].toInfo());
                }
            }
        }
        return list;
    }
});

ConfigSchema.method('toInfo', function () {
    return {
        config_id: this.config_id,
        score1: this.score1,
        score2: this.score2,
        key1: this.key1,
        key2: this.key2,
        key3: this.key3,
        key4: this.key4,
        key5: this.key5,
        key6: this.key6,
        key7: this.key7,
        key8: this.key8,
        key9: this.key9,
    }
});

UserFillSchema.index({createdAt: -1});
QuestionSchema.index({createdAt: -1});
EStoreSchema.index({createdAt: -1});
PointSchema.index({createdAt: -1});
ExerciseSchema.index({createdAt: -1});
EStepSchema.index({createdAt: -1});

mongoose.model('wxdemo2UserFillInfo', UserFillSchema, 'wxdemo2UserFillInfo');
mongoose.model('wxdemo2Question', QuestionSchema, 'wxdemo2Question');
mongoose.model('wxdemo2EStore', EStoreSchema, 'wxdemo2EStore');
mongoose.model('wxdemo2Skill', SkillSchema, 'wxdemo2Skill');
mongoose.model('wxdemo2Point', PointSchema, 'wxdemo2Point');
mongoose.model('wxdemo2Exercise', ExerciseSchema, 'wxdemo2Exercise');
mongoose.model('wxdemo2EStep', EStepSchema, 'wxdemo2EStep');
mongoose.model('wxdemo2Config', ConfigSchema, 'wxdemo2Config');

