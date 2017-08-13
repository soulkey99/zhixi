/**
 * Created by MengLei on 2016-04-27.
 */
"use strict";
const mongoose = require('./../index').byConn;
const BaseModel = require('../baseModel');
const Schema = require('mongoose').Schema;

let VersionSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    stage: {type: String, default: ''}, //学段
    grade: {type: String, default: ''}, //年级
    subject: {type: String, default: ''},   //学科
    version: {type: String, default: ''},   //版本
    city: {type: [String], default: []},    //城市
    title: {type: String, default: ''},     //书名
    intro: {type: String, default: ''},     //简介
    cover: {type: String, default: ''},     //封面
    remark: {type: String, default: ''},    //备注
    type: {type: String, default: 'book', enum: ['book', 'exercise']},  //类型：教材、练习册
    seq: {type: Number, default: 0},        //排序
    createAt: {type: Number, default: 0},   //创建时间
    updateAt: {type: Number, default: 0}    //更新时间
}, {timestamps: 1, id: false, read: 'sp'});

VersionSchema.plugin(BaseModel);

VersionSchema.virtual('ver_id').get(function () {
    return this._id.toString();
});

VersionSchema.method('toDetail', function () {
    return {
        ver_id: this.ver_id,
        stage: this.stage,
        grade: this.grade,
        subject: this.subject,
        version: this.version,
        title: this.title,
        intro: this.intro,
        cover: this.cover,
        remark: this.remark,
        type: this.type,
        seq: this.seq
    }
});

VersionSchema.pre('save', function (next) {
    this.updateAt = Date.now();
    if (!this.createAt) {
        this.createAt = this.updateAt;
    }
    next();
});

mongoose.model('StudyVersion', VersionSchema, 'studyMaterialVersion');
