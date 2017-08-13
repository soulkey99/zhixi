/**
 * Created by MengLei on 2016-04-26.
 */
"use strict";
const mongoose = require('./../index').byConn;
const BaseModel = require('../baseModel');
const Schema = require('mongoose').Schema;
//知识点
let ChapterSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    ver_id: {type: Schema.Types.ObjectId},   //对应的教材版本
    title: {type: String, default: ''},
    remark: {type: String, default: ''},
    type: {type: String, default: 'chapter'},
    sections: {type: [Schema.Types.ObjectId]},
    seq: {type: Number, default: 0},
    createAt: {type: Number, default: 0},   //创建时间
    updateAt: {type: Number, default: 0}    //更新时间
});

ChapterSchema.plugin(BaseModel);

ChapterSchema.virtual('cha_id').get(function () {
    return this._id.toString();
});

ChapterSchema.pre('save', function (next) {
    this.updateAt = Date.now();
    if (!this.createAt) {
        this.createAt = this.updateAt;
    }
    next();
});

mongoose.model('StudyChapter', ChapterSchema, 'studyMaterialChapter');

let SectionSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    title: {type: String, default: ''},
    remark: {type: String, default: ''},
    type: {type: String, default: 'section'},
    seq: {type: Number, default: 0},
    questions: {type: [Schema.Types.ObjectId], default: []},   //节下的所属问题
    createAt: {type: Number, default: 0},   //创建时间
    updateAt: {type: Number, default: 0}    //更新时间
});

SectionSchema.plugin(BaseModel);

SectionSchema.virtual('sec_id').get(function () {
    return this._id.toString();
});

SectionSchema.pre('save', function (next) {
    this.updateAt = Date.now();
    if (!this.createAt) {
        this.createAt = this.updateAt;
    }
    next();
});

mongoose.model('StudySection', SectionSchema, 'studyMaterialSection');
