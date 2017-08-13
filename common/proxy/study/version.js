/**
 * Created by MengLei on 2016-04-27.
 */
"use strict";
const model = require('../../model');
const eventproxy = require('eventproxy');
const Version = model.StudyVersion;

/**
 * 添加、编辑、删除版本
 * Callback:
 * - err, 数据库异常
 * - doc, 列表
 * @param {Object} param 版本的内容，{ver_id: '', action: '', stage: '', grade: '', subject: '', city: '', version: '', cover: '', remark: ''}
 * @param {Function} callback 回调函数
 */
exports.editVersion = function (param, callback) {
    return new Promise((resolve, reject)=> {
        getVersionByIdOrNew(param.ver_id, (err, version)=> {
            if (err) {
                callback && callback(err);
                return reject(err);
            }
            if (param.action == 'remove') {
                Version.findByIdAndRemove(version._id, (err, doc)=> {
                    if (err) {
                        callback && callback(err);
                        return reject(err);
                    }
                    callback && callback(null, doc);
                    return resolve(doc);
                });
                return;
            }
            if (param.stage != undefined) {
                version.stage = param.stage;
            }
            if (param.grade != undefined) {
                version.grade = param.grade;
            }
            if (param.subject != undefined) {
                version.subject = param.subject;
            }
            if (param.city != undefined) {
                version.city = param.city.split(',');
            }
            if (param.version != undefined) {
                version.version = param.version;
            }
            if (param.cover != undefined) {
                version.cover = param.cover;
            }
            if (param.remark != undefined) {
                version.remark = param.remark;
            }
            version.save((err, doc)=> {
                if (err) {
                    callback && callback(err);
                    return reject(err);
                }
                callback && callback(null, doc);
                return resolve(doc);
            });
        });
    });
    function getVersionByIdOrNew(id, callback) {
        if (!id) {
            return callback(null, new Version());
        }
        Version.findById(id, (err, version)=> {
            if (err) {
                return callback(err);
            }
            if (!version) {
                return callback(new Error('ver_id对应内容不存在！'));
            }
            if (version.type != 'version') {
                return callback(new Error('ver_id对应的内容类型不正确！'));
            }
            callback(null, version);
        });
    }
};

/**
 * 获取版本列表
 * Callback:
 * - err, 数据库异常
 * - doc, 列表
 * @param {Object} param 版本的内容，{stage: '', grade: '', subject: '', city: '', startPos: '', pageSize: '', userType: '', action: 'getMore'}
 * 若userType='student',那么是学生端获取，如果传城市，那么第一次默认返回对应城市的数据，然后getMore的时候返回除该城市外的其他数据，如果没传城市，那么一次将所有数据返回
 * @param {Function} callback 回调函数
 */
exports.getList = function (param, callback) {
    let start = 0;
    let count = Number.parseInt(param.limit || '10');
    if (param.start) {
        start = Number.parseInt(param.start) - 1;
    } else if (param.page) {
        start = (Number.parseInt(param.page || '1') - 1) * count;
    }
    let query = {};
    let opt = {sort: '-createAt'};
    if (param.stage != undefined) {
        query['stage'] = param.stage;
    }
    if (param.grade != undefined) {
        query['grade'] = param.grade;
    }
    if (param.subject != undefined) {
        query['subject'] = param.subject;
    }
    if (param.city != undefined) {
        if (param.userType == 'student') {
            if (param.action == 'getMore') {
                query['city'] = {$ne: param.city};
            } else {
                query['city'] = param.city;
            }
        } else {
            query['city'] = param.city;
            opt['skip'] = start;
            opt['limit'] = count;
        }
    } else {
        opt['skip'] = start;
        opt['limit'] = count;
    }
    return new Promise((resolve, reject)=> {
        Version.find(query, {}, opt, (err, doc)=> {
            if (err) {
                callback && callback(err);
                return reject(err);
            }
            let list = [];
            for (let i = 0; i < doc.length; i++) {
                list.push({
                    ver_id: doc[i].ver_id,
                    stage: doc[i].stage,
                    grade: doc[i].grade,
                    subject: doc[i].subject,
                    version: doc[i].version,
                    city: doc[i].city,
                    cover: doc[i].cover,
                    remark: doc[i].remark
                });
            }
            callback && callback(null, list);
            resolve(list);
        });
    });
};

/**
 * 学生端获取教材版本列表
 * 学生端如果传城市，那么第一次默认返回对应城市的数据，然后getMore的时候返回除该城市外的其他数据，如果没传城市，那么一次将所有数据返回
 * Callback:
 * - err, 数据库异常
 * - doc, 列表
 * @param {Object} param 版本的内容，{stage: '', grade: '', subject: '', city: '', action: 'getMore'}
 * @param {Function} callback 回调函数
 */
exports.getVersionList = function (param, callback) {
    let query = {};
    if (param.stage != undefined) {
        query['stage'] = param.stage;
    }
    if (param.grade != undefined) {
        query['grade'] = param.grade;
    }
    if (param.subject != undefined) {
        query['subject'] = param.subject;
    }
    if (param.city != undefined) {
        if (param.action == 'getMore') {
            query['city'] = {$ne: param.city};
        } else {
            query['city'] = param.city;
        }
    }
};


exports.getVersionGradeList = function *(param) {
    let res = yield model.StudyVersion.aggregate(
        {$group: {_id: '$version'}}
    );
    let list = [];
    for (let i = 0; i < res.length; i++) {
        let item = yield model.StudyVersion.find({version: res[i]._id}).sort({seq: 1});
        list.push({
            version: res[i]._id,
            grades: item.map(i=>i.grade)
        });
    }
};

function agg(pipeline, callback) {
    return function (callback) {
        model.StudyVersion.aggregate(pipeline, callback);
    }
}