/**
 * Created by MengLei on 2016/4/7.
 */
"use strict";
const mongoose = require('./../index').byConn;
const BaseModel = require('../baseModel');
const Schema = require('mongoose').Schema;
//问题
//问题和选项都使用一个html片段来进行格式化展示，这样可以保证图文混排的展示方式比较简单
let ChoiceSchema = new Schema({
    content: {type: String, default: ''},   //选项内容
    action: {type: String, default: ''},  //选项类型（next：下一题，question：提示审题，hint：弹hint字段，result：到结果页）
    correct: {type: Boolean},   //是否正确答案
    flag: {type: String, default: ''},  //标识
    hint: {type: String, default: ''},  //提示
    remark: {type: String, default: ''},
    next: {type: Schema.Types.ObjectId}   //下一题id
});

let QuestionSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    stage: {type: String},  //学段（只有题干才有）
    grade: {type: String},  //年级（只有题干才有）
    subject: {type: String},    //科目（只有题干才有）
    root_id: {type: Schema.Types.ObjectId},     //如果是过程或者结论，那么它属于的题干的id，题干没有此字段
    next: {type: Schema.Types.ObjectId}, //如果是根，那么下一步要进行的题目id
    type: {type: String, default: 'root'},  //类型，root题干，prepare准备理解，procedure解题过程，conclusion结论，review回顾
    content: {type: String, default: ''},   //内容
    choice: {type: [ChoiceSchema], default: []},    //选项
    point: {type: [Schema.Types.ObjectId], default: []},     //相关知识点id list
    related: {type: [Schema.Types.ObjectId], default: []},    //相关题目id list
    enhance: {type: [Schema.Types.ObjectId], default: []},    //相关提高题id list
    difficulty: {type: Number, default: 1},     //题目难度
    shortestPath: {type: [Schema.Types.ObjectId], default: []},   //最短路径，仅root有
    remark: {type: String, default: ''},    //备注
    userID: {type: Schema.Types.ObjectId},   //录入者ID
    status: {type: String, enum: ['pending', 'verified', 'failed'], default: 'pending'},
    msg: {type: String, default: ''},    //错误信息
    createAt: {type: Number, default: 0},   //创建时间
    updateAt: {type: Number, default: 0}    //更新时间
}, {timestamps: 1, read: 'sp', id: false});

QuestionSchema.plugin(BaseModel);

ChoiceSchema.virtual('choice_id').get(function () {
    return this._id.toString();
});
QuestionSchema.virtual('q_id').get(function () {
    return this._id.toString();
});

QuestionSchema.pre('save', function (next) {
    switch (this.type) {
        case 'root':
            delete(this.root_id);
            delete(this.choice);
            delete(this.choice_id);
            break;
        case 'prepare':
        case 'procedure':
        case 'conclusion':
            delete(this.stage);
            delete(this.grade);
            delete(this.class);
            delete(this.point);
            delete(this.related);
            delete(this.enhance);
            break;
    }
    this.updateAt = Date.now();
    if (!this.createAt) {
        this.createAt = this.updateAt;
    }
    next();
});

QuestionSchema.method('toShortestPath', function *() {
    let q = this;
    let questionModel = mongoose.model('StudyQuestion');
    if (q.type != 'root') { //如果传入的不是root节点，那么取root节点
        q = yield questionModel.findById(q.root_id);
    }
    if (q.shortestPath && q.shortestPath.length > 0) { //如果已有结果，则不必再计算
        return q.shortestPath;
    }
    let start = q.q_id; //起始点
    let end = '';   //终点
    let data = {};  //中间节点数据
    if (!data[q.q_id]) {
        data[q.q_id] = new Set();  //set结构，可以去重
    }
    if (!data[q.next.toString()]) {
        data[q.next.toString()] = new Set();
    }
    data[q.q_id].add(q.next.toString());
    data[q.next.toString()].add(q.q_id);
    yield next_node(q.next);
    function* next_node(id) {
        let q = yield questionModel.findById(id);
        if (!data[q.q_id]) {
            data[q.q_id] = new Set();
        }
        for (let i = 0; i < q.choice.length; i++) {
            if (q.choice[i].action == 'result') {
                end = q.q_id;
            }
            // console.log(`q_id: ${q.q_id}, action: ${q.choice[i].action}, next_id: ${q.choice[i].next}`);
            if (q.choice[i].next) {
                data[q.q_id].add(q.choice[i].next.toString());
                if (!data[q.choice[i].next.toString()]) {
                    data[q.choice[i].next.toString()] = new Set();
                }
                data[q.choice[i].next.toString()].add(q.q_id);
                yield next_node(q.choice[i].next);
            }
        }
    }

    let gtest = new Graph();
    for (let item in data) {
        let arr = Array.from(data[item]);
        let vertext = {};
        for (let i = 0; i < arr.length; i++) {
            vertext[arr[i]] = 1;
        }
        gtest.addVertex(item, vertext);
    }
    let path = gtest.shortestPath(start, end).concat([start]).reverse();
    if (q.type == 'root') {
        yield questionModel.findByIdAndUpdate(q._id, {$set: {shortestPath: path}});
    }
    return path;
});
QuestionSchema.static('shortestPath', function *(q_id) {
    q_id = q_id || '5799529a86bd1c8379152760';
    let q = yield mongoose.model('StudyQuestion').findById(q_id);
    return yield q.toShortestPath();
});
QuestionSchema.method('toItem', function () {
    let info = {
        q_id: this.q_id,
        type: this.type,
        content: this.content,
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
        for (let i = 0; i < this.choice.length; i++) {
            info.choice.push({
                action: this.choice[i].action,
                choice_id: this.choice[i]._id,
                content: this.choice[i].content,
                correct: this.choice[i].correct,
                flag: this.choice[i].flag,
                hint: this.choice[i].hint,
                next: this.choice[i].next || ''
            });
        }
    }
    return info;
});

mongoose.model('StudyQuestion', QuestionSchema, 'studyQuestions');

//以下为计算最短路径的算法
function PriorityQueue() {
    this._nodes = [];

    this.enqueue = function (priority, key) {
        this._nodes.push({key: key, priority: priority});
        this.sort();
    };
    this.dequeue = function () {
        return this._nodes.shift().key;
    };
    this.sort = function () {
        this._nodes.sort(function (a, b) {
            return a.priority - b.priority;
        });
    };
    this.isEmpty = function () {
        return !this._nodes.length;
    };
}
function Graph() {
    let INFINITY = 1 / 0;
    this.vertices = {};

    this.addVertex = function (name, edges) {
        this.vertices[name] = edges;
    };

    this.shortestPath = function (start, finish) {
        let nodes = new PriorityQueue(),
            distances = {},
            previous = {},
            path = [],
            smallest, vertex, neighbor, alt;

        for (vertex in this.vertices) {
            if (vertex === start) {
                distances[vertex] = 0;
                nodes.enqueue(0, vertex);
            }
            else {
                distances[vertex] = INFINITY;
                nodes.enqueue(INFINITY, vertex);
            }

            previous[vertex] = null;
        }

        while (!nodes.isEmpty()) {
            smallest = nodes.dequeue();

            if (smallest === finish) {
                path;
                while (previous[smallest]) {
                    path.push(smallest);
                    smallest = previous[smallest];
                }
                break;
            }
            if (!smallest || distances[smallest] === INFINITY) {
                continue;
            }
            for (neighbor in this.vertices[smallest]) {
                alt = distances[smallest] + this.vertices[smallest][neighbor];

                if (alt < distances[neighbor]) {
                    distances[neighbor] = alt;
                    previous[neighbor] = smallest;

                    nodes.enqueue(alt, neighbor);
                }
            }
        }

        return path;
    }
}
