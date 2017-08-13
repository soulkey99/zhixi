/**
 * Created by MengLei on 2016-04-11.
 */
"use strict";
const model = require('../../model');
const eventproxy = require('eventproxy');
const lodash = require('lodash');
const Question = model.StudyQuestion;

/**
 * 根据id获取问题记录
 * Callback:
 * - err, 数据库异常
 * - doc, 列表
 * @param {String} id 问题id
 * @param {Function} [callback] 回调函数
 */
exports.getQuestionByID = function (id, callback) {
    return new Promise((resolve, reject)=> {
        Question.findById(id, (err, doc)=> {
            if (err) {
                callback && callback(err);
                return reject(err);
            }
            callback && callback(doc);
            return resolve(doc);
        });
    });
};

/**
 * 根据query获取问题记录
 * Callback:
 * - err, 数据库异常
 * - doc, 列表
 * @param {Object} query 查询条件
 * @param {Object} opt 限制条件
 * @param {Function} [callback] 回调函数
 */
exports.getQuestionsByQuery = function (query, opt, callback) {
    return new Promise((resolve, reject)=> {
        Question.find(query, {}, opt, (err, doc)=> {
            if (err) {
                callback && callback(err);
                return reject(err);
            }
            callback && callback(doc);
            return resolve(doc);
        });
    });
};

/**
 * 根据选项id获取问题记录
 * Callback:
 * - err, 数据库异常
 * - doc, 列表
 * @param {String} id 问题id
 * @param {Function} [callback] 回调函数
 */
exports.getChoice = function (id, callback) {
    return new Promise((resolve, reject)=> {
        Question.findOne({'choice._id': id}, (err, doc)=> {
            if (err) {
                callback && callback(err);
                return reject(err);
            }
            if (!doc) {
                let err = new Error('对应的问题不存在！');
                callback && callback(err);
                return reject(err);
            }
            let choice = doc.choice.id(id);
            if (!choice) {
                let err = new Error('对应的选项不存在！');
                callback && callback(err);
                return reject(err);
            }
            callback && callback(null, choice);
            resolve(choice);
        });
    });
};

/**
 * 为问题的选项添加下一步的id
 * Callback:
 * - err, 数据库异常
 * - doc, 列表
 * @param {Object} param = {q_id: '', choice_id: '', next: ''}
 * @param {Function} [callback] 回调函数
 */
exports.editNext = function (param, callback) {
    return new Promise((resolve, reject)=> {
        if (!param.next) {
            let err = new Error('next不能为空！');
            callback && callback(err);
            return reject(err);
        }
        Question.findById(param.next, (err, next)=> {
            if (err) {
                callback && callback(err);
                return reject(err);
            }
            if (!next) {
                let err = new Error('next 不存在！');
                callback && callback(err);
                return reject(err);
            }
            if (param.choice_id) {
                Question.findOne({'choice._id': param.choice_id}, (err, question)=> {
                    if (err) {
                        callback && callback(err);
                        return reject(err);
                    }
                    if (!question) {
                        let err = new Error('choice_id 不存在！');
                        callback && callback(err);
                        return reject(err);
                    }
                    question.choice.id(param.choice_id).next = param.next;
                    question.save((err, doc)=> {
                        if (err) {
                            callback && callback(err);
                            return reject(err);
                        }
                        callback && callback(null, doc);
                        resolve(doc);
                    });
                });
            } else if (param.q_id) {
                Question.findById(param.q_id, (err, question)=> {
                    if (err) {
                        callback && callback(err);
                        return reject(err);
                    }
                    if (!question) {
                        let err = new Error('q_id 不存在！');
                        callback && callback(err);
                        return reject(err);
                    }
                    if (question.type != 'root') {
                        let err = new Error('q_id对应问题的类型不正确！');
                        callback && callback(err);
                        return reject(err);
                    }
                    question.next = param.next;
                    question.save((err, doc)=> {
                        if (err) {
                            callback && callback(err);
                            return reject(err);
                        }
                        callback && callback(null, doc);
                        resolve(doc);
                    });
                })
            } else {
                let err = new Error('无q_id或者choice_id！');
                callback && callback(err);
                return reject(err);
            }
        });
    });
};

/**
 * 为问题的选项添加知识点、相关题目、提高题目的id
 * Callback:
 * - err, 数据库异常
 * - doc, 列表
 * @param {Object} param = {q_id: '', type: '要修改的字段point/related/enhance', extra_id: '附加的id列表，多个逗号分隔'}
 * @param {Function} callback 回调函数
 */
exports.editExtra = function (param, callback) {
    return new Promise((resolve, reject)=> {
        if (param.extra_id == undefined) {
            let err = new Error('extra_id不能为空！');
            callback && callback(err);
            return reject(err);
        }
        if (!param.type) {
            let err = new Error('type字段不能为空！');
            callback && callback(err);
            return reject(err);
        }
        let list = [];
        if (param.extra_id) {
            list = param.extra_id.split(',');
        }
        let setObj = {};
        setObj[param.type] = list;
        Question.findByIdAndUpdate(param.q_id, {$set: {point: list}}, {new: true}, (err, doc)=> {
            if (err) {
                callback && callback(err);
                return reject(err);
            }
            if (!doc) {
                let err = new Error('q_id对应问题不存在！');
                callback && callback(err);
                return reject(err);
            }
            callback && callback(null, doc);
            resolve(doc);
        });
    });
};

/**
 * 获取问题列表
 * Callback:
 * - err, 数据库异常
 * - doc, 列表
 * @param {Object} param = {startPos: '', pageSize: '', query: '', stage: '', grade: '', subject: '', type: ''}
 * @param {Function} callback 回调函数
 */
exports.getList = function (param, callback) {
    let query = {type: 'root'};
    let start = Number.parseInt(param.startPos || '1') - 1;
    let count = Number.parseInt(param.pageSize || '10');
    if (param.query) {
        query['$or'] = [{content: {$regex: param.query}}, {'choice.content': {$regex: param.query}}];
    }
    if (param.stage) {
        query['stage'] = param.stage;
    }
    if (param.grade) {
        query['grade'] = param.grade;
    }
    if (param.subject) {
        query['subject'] = param.subject;
    }
    return new Promise((resolve, reject)=> {
        Question.find(query, {}, {skip: start, limit: count, sort: '-createAt'}, (err, doc)=> {
            if (err) {
                callback && callback(err);
                return reject(err);
            }
            let list = [];
            for (let i = 0; i < doc.length; i++) {
                list.push({
                    q_id: doc[i].q_id,
                    stage: doc[i].stage,
                    grade: doc[i].grade,
                    subject: doc[i].subject,
                    type: doc[i].type,
                    content: doc[i].content,
                    remark: doc[i].remark
                });
            }
            callback && callback(null, list);
            resolve(list);
        });
    });
};

/**
 * 获取问题附加信息列表
 * Callback:
 * - err, 数据库异常
 * - doc, 列表
 * @param {Object} param = {q_id: '', type: '', limit: ''}
 * @param {Function} callback 回调函数
 */
exports.getExtra = function (param, callback) {
    return new Promise((resolve, reject)=> {
        if (!param.type) {
            let err = new Error('type字段为空！');
            callback && callback(err);
            return reject(err);
        }
        Question.findById(param.q_id, (err, doc)=> {
            if (err) {
                callback && callback(err);
                return reject(err);
            }
            if (!doc) {
                let err = new Error('q_id不存在！');
                callback && callback(err);
                return reject(err);
            }
            let limit = Number.parseInt(param.limit || '1');
            let ids = lodash.sampleSize(doc[param.type], limit);
            if (limit == 0) {   //limit = 0的时候标识获取全部
                ids = doc[param.type];
            }
            let list = [];
            if (param.type == 'point') {
                model.StudyPoint.find({_id: {$in: ids}}, (err2, doc2)=> {
                    if (err2) {
                        callback && callback(err2);
                        return reject(err2);
                    }
                    for (let i = 0; i < doc2.length; i++) {
                        list.push(doc2[i].toObject({getters: true}));
                    }
                    callback && callback(null, list);
                    return resolve(list);
                });
            } else {
                Question.find({_id: {$in: ids}}, (err2, doc2)=> {
                    if (err2) {
                        callback && callback(err2);
                        return reject(err2);
                    }
                    for (let i = 0; i < doc2.length; i++) {
                        list.push(doc2[i].toObject({getters: true}));
                    }
                    callback && callback(null, list);
                    return resolve(list);
                });
            }
        });
    });
};

/**
 * 获取整个问题树
 * Callback:
 * - err, 数据库异常
 * - doc, 列表
 * @param {Object} q_id root问题的id
 * @param {Function} callback 回调函数
 */
exports.getFullQuestion = function (q_id, callback) {
    return new Promise((resolve, reject)=> {
        Question.findById(q_id, (err, root)=> {
            if (err) {
                callback && callback(err);
                return reject(err);
            }
            if (!root) {
                let err = new Error('q_id对应的问题不存在！');
                callback && callback(err);
                return reject(err);
            }
            if (root.type != 'root') {
                let err = new Error('q_id对应的问题类型不是root！');
                callback && callback(err);
                return reject(err);
            }
            let body = {
                id: root._id.toString(),
                name: root.content,
                data: {type: 'root', parentId: ''},
                children: []
            };
            Question.find({root_id: root._id}, (err, doc)=> {
                if (err) {
                    callback && callback(err);
                    return reject(err);
                }
                for (let i = 0; i < doc.length; i++) {
                    if (root.next.toString() == doc[i]._id.toString()) {
                        let child = {
                            id: doc[i]._id.toString(),
                            name: doc[i].content,
                            data: {type: 'question'},
                            children: []
                        };
                        for (let j = 0; j < doc[i].choice.length; j++) {
                            let choiceItem = {
                                id: doc[i].choice[j]._id.toString(),
                                name: doc[i].choice[j].content,
                                data: {
                                    type: 'choice',
                                    parentId: doc[i]._id.toString()
                                },
                                next: '',
                                children: []
                            };
                            if (doc[i].choice[j].next) {
                                choiceItem.next = doc[i].choice[j].next.toString();
                            }
                            arrangeNext(choiceItem);
                            child.children.push(choiceItem);
                        }
                        body.children.push(child);
                    }
                }
                callback && callback(null, body);
                resolve(body);
                function arrangeNext(item) {
                    if (item.next) {
                        for (let i = 0; i < doc.length; i++) {
                            if (item.next == doc[i]._id.toString()) {
                                let nextItem = {
                                    id: doc[i]._id.toString(),
                                    name: doc[i].content,
                                    data: {
                                        type: 'question',
                                        parentId: item.id
                                    },
                                    children: []
                                };
                                for (let j = 0; j < doc[i].choice.length; j++) {
                                    let choiceItem = {
                                        id: doc[i].choice[j]._id.toString(),
                                        name: doc[i].choice[j].content,
                                        data: {
                                            type: 'choice',
                                            parentId: doc[i]._id.toString()
                                        },
                                        children: []
                                    };
                                    if (doc[i].choice[j].next) {
                                        choiceItem.next = doc[i].choice[j].next.toString();
                                    }
                                    arrangeNext(choiceItem);
                                    nextItem.children.push(choiceItem);
                                }
                                item.children.push(nextItem);
                            }
                        }
                    }
                }
            });
        });
    });
};

/**
 * 添加、编辑问题
 * Callback:
 * - err, 数据库异常
 * - doc, 列表
 * @param {Object} param 问题内容，{q_id: '', choice_id: '', content: '', correct: '', hint: '', flag: '', action: '', next: ''}
 * @param {Function} callback 回调函数
 */
exports.editChoice = function (param, callback) {
    return new Promise((resolve, reject)=> {
        let ep = new eventproxy();
        ep.all('question', (question)=> {
            if (!question) {
                let err = new Error('对应的问题不存在！');
                callback && callback(err);
                return reject(err);
            }
            if (param.choice_id) {
                if (!question.choice.id(param.choice_id)) {
                    let err = new Error('choice_id不存在！');
                    callback && callback(err);
                    return reject(err);
                }
                if (param.content != undefined) {
                    question.choice.id(param.choice_id).content = param.content;
                }
                if (param.hint != undefined) {
                    question.choice.id(param.choice_id).hint = param.hint;
                }
                if (param.remark != undefined) {
                    question.choice_id.id(param.choice_id).remark = param.remark;
                }
                if (param.next != undefined) {
                    question.choice.id(param.choice_id).next = param.next;
                }
                if (param.action != undefined) {
                    question.choice.id(param.choice_id).action = param.action;
                }
                if (param.flag != undefined) {
                    question.choice.id(param.choice_id).flag = param.flag;
                }
                if (param.correct != undefined) {
                    question.choice.id(param.choice_id).correct = (param.correct == 'true');
                }
            } else {
                let item = {content: param.content, hint: '', flag: param.flag, action: param.action};
                if (param.hint) {
                    item.hint = param.hint;
                }
                if (param.next) {
                    item.next = param.next;
                }
                if (param.remark != undefined) {
                    question.choice_id.id(param.choice_id).remark = param.remark;
                }
                if (param.correct != undefined) {
                    item.correct = (param.correct == 'true');
                }
                question.choice.push(item);
            }
            question.save((err, doc)=> {
                if (err) {
                    callback && callback(err);
                    return reject(err);
                }
                callback && callback(null, doc);
                return resolve(doc);
            });
        });
        ep.fail(err=> {
            callback && callback(err);
            reject(err);
        });
        if (param.q_id) {
            Question.findById(param.q_id, ep.done('question'));
        } else if (param.choice_id) {
            Question.findOne({'choice._id': param.choice_id}, ep.done('question'));
        } else {
            let err = new Error('请输入q_id或者choice_id！');
            callback && callback(err);
            return reject(err);
        }
    });
};

/**
 * 添加、编辑问题
 * Callback:
 * - err, 数据库异常
 * - doc, 列表
 * @param {Object} param 问题内容，{q_id: '', prev_id: '', choice_id: '', type: '', stage: '', grade: '', subject: '', content: '', choice: [], point: '', related: '', remark: '', extend: ''}
 * @param {Function} callback 回调函数
 */
exports.editQuestion = function (param, callback) {
    return new Promise((resolve, reject)=> {
        getQuestionByIdOrNew(param.q_id, (err, question)=> {
            if (err) {
                callback && callback(err);
                return reject(err);
            }
            if (param.type) {
                question.type = param.type;
            }
            question.content = param.content;
            if (param.remark != undefined) {
                question.remark = param.remark;
            }
            if (param.action != undefined) {
                question.action = param.action;
            }
            question.point = !!param.point ? param.point.split(',') : [];
            question.related = !!param.related ? param.related.split(',') : [];
            question.enhance = !!param.enhance ? param.enhance.split(',') : [];
            switch (question.type) {
                case 'root':
                    question.stage = param.stage;
                    question.grade = param.grade;
                    question.subject = param.subject;
                    question.save((err, doc)=> {
                        if (err) {
                            callback && callback(err);
                            return reject(err);
                        }
                        callback && callback(null, doc);
                        return resolve(doc);
                    });
                    break;
                case 'prepare':
                case 'procedure':
                case 'conclusion': {
                    if (!!param.q_id && (!param.prev_id && !param.choice_id)) {
                        //如果传了q_id，表明是编辑，没有传prev_id或者choice_id，表明不修改上下级关系，那么只要更改选项即可
                        if (param.choice) {
                            try {
                                question.choice = JSON.parse(param.choice);
                            } catch (ex) {
                                let err = new Error('choice解析失败！');
                                callback && callback(err);
                                return reject(err);
                            }
                        }
                        return question.save((err, doc)=> {
                            if (err) {
                                callback && callback(err);
                                return reject(err);
                            }
                            callback && callback(null, doc);
                            return resolve(doc);
                        });
                    }
                    checkPrev(param, (err, prev)=> {
                        if (err) {
                            callback && callback(err);
                            return reject(err);
                        }
                        getRoot(param.prev_id || param.choice_id, (err, root)=> {
                            if (err) {
                                callback && callback(err);
                                return reject(err);
                            }
                            if (!root) {
                                let err = new Error('无法找到root节点！');
                                callback && callback(err);
                                return reject(err);
                            }
                            question.root_id = root._id;
                            if (param.choice) {
                                try {
                                    question.choice = JSON.parse(param.choice);
                                } catch (ex) {
                                    let err = new Error('choice解析失败！');
                                    callback && callback(err);
                                    return reject(err);
                                }
                            }
                            question.save((err2, doc2)=> {
                                if (err2) {
                                    callback && callback(err2);
                                    return reject(err2);
                                }
                                if (prev.type == 'root') {
                                    prev.next = doc2._id;
                                } else {
                                    prev.choice.id(param.choice_id).next = doc2._id;
                                }
                                prev.save((err3)=> {
                                    if (err3) {
                                        callback && callback(err3);
                                        return reject(err3);
                                    }
                                    callback && callback(null, doc2);
                                    return resolve(doc2);
                                });
                            });
                        });
                    });
                }
                    break;
                default: {
                    let err = new Error('type错误！');
                    callback && callback(err);
                    reject(err);
                    break;
                }
            }
        });
    });
    switch (param.type) {
        case 'root':
            //对于root节点，不需要choice_id，不需要choice，需要使用stage、grade、subject
            getQuestionByIdOrNew(param.q_id, (err, question)=> {
                if (err) {
                    return callback(err);
                }
                question.type = param.type;
                question.content = param.content;
                if (param.remark != undefined) {
                    question.remark = param.remark;
                }
                if (param.action != undefined) {
                    question.action = param.action;
                }
                question.point = !!param.point ? param.point.split(',') : [];
                question.related = !!param.related ? param.related.split(',') : [];
                question.enhance = !!param.enhance ? param.enhance.split(',') : [];
                question.save(callback);
            });
            break;
        case 'prepare':
        case 'procedure':
        case 'conclusion': {
            checkPrev(param, (err, prev)=> {
                if (err) {
                    return callback(err);
                }
                getQuestionByIdOrNew(param.q_id, (err, question)=> {
                    if (err) {
                        return callback(err);
                    }
                    getRoot(param.prev_id || param.choice_id, (err, root)=> {
                        if (err) {
                            return callback(err);
                        }
                        if (!root) {
                            return callback(new Error('无法找到root节点！'));
                        }
                        question.type = param.type;
                        question.root_id = root._id;
                        question.content = param.content;
                        if (param.remark != undefined) {
                            question.remark = param.remark;
                        }
                        if (param.action != undefined) {
                            question.action = param.action;
                        }
                        if (param.choice) {
                            try {
                                question.choice = JSON.parse(param.choice);
                            } catch (ex) {
                                return callback(new Error('choice解析失败！'));
                            }
                        }
                        question.point = !!param.point ? param.point.split(',') : [];
                        question.related = !!param.related ? param.related.split(',') : [];
                        question.enhance = !!param.enhance ? param.enhance.split(',') : [];
                        if (param.choice_id) {
                            question.choice_id = param.choice_id;
                        }
                        if (param.root_id) {
                            question.root_id = param.root_id;
                        }
                        question.save((err2, doc2)=> {
                            if (err2) {
                                return callback(err2);
                            }
                            if (prev.type == 'root') {
                                prev.next = doc2._id;
                            } else {
                                prev.choice.id(param.choice_id).next = doc2._id;
                            }
                            prev.save((err3)=> {
                                if (err3) {
                                    return callback(err3);
                                }
                                return callback(null, doc2);
                            });
                        });
                    });
                });
            });
        }
            break;
        default:
            callback(new Error('type错误！'));
            break;
    }
};

//通过id获取一个问题记录，如果没有，就new一个
function getQuestionByIdOrNew(id, callback) {
    if (!id) {
        return callback(null, new Question());
    }
    Question.findById(id, (err, doc)=> {
        if (err) {
            return callback(err);
        }
        if (!doc) {
            return callback(null, new Question({_id: id}));
        }
        return callback(null, doc);
    });
}
//校验录入的问题的choice_id合法性
function checkPrev(param, callback) {
    if (param.type == 'root') {
        return callback();
    }
    if (param.prev_id) {
        Question.findById(param.prev_id, (err, doc)=> {
            if (err) {
                return callback(err);
            }
            if (!doc) {
                return callback(new Error('prev_id不存在！'));
            }
            return callback(null, doc);
        });
    } else if (param.choice_id) {
        Question.findOne({'choice._id': param.choice_id}, (err, doc)=> {
            if (err) {
                return callback(err);
            }
            if (!doc) {
                return callback(new Error('choice_id不存在！'));
            }
            return callback(null, doc);
        });
    } else {
        return callback(new Error('请添加上级问题信息！'));
    }
}
//通过choice_id或prev_id获取对应的root doc
function getRoot(choice_id, callback) {
    function getPrevCB(err, doc) {
        if (err) {
            return callback(err);
        }
        if (!doc) {
            return callback();
        }
        if (doc.type == 'root') {
            return callback(null, doc);
        }
        getPrev(doc._id, getPrevCB)
    }

    //通过id获取对应的prev doc
    function getPrev(id, callback) {
        Question.findOne({$or: [{'choice.next': id}, {next: id}]}, (err, doc)=> {
            if (err) {
                return callback(err);
            }
            if (!doc) {
                return callback();
            }
            return callback(null, doc);
        });
    }

    Question.findOne({$or: [{_id: choice_id}, {'choice._id': choice_id}]}, (err, doc)=> {
        if (err) {
            return callback(err);
        }
        if (!doc) {
            return callback();
        }
        if (doc.type == 'root') {
            return callback(null, doc);
        }
        getPrev(doc._id, getPrevCB)
    });
}


