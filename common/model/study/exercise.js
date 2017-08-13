/**
 * Created by MengLei on 2016-04-18.
 */
"use strict";
const mongoose = require('mongoose');
const BaseModel = require('../baseModel');
const Schema = mongoose.Schema;
//
let StepSchema = new Schema({
    q_id: {type: Schema.Types.ObjectId},
    type: {type: String},
    choice_id: {type: Schema.Types.ObjectId},
    t: {type: Date}
}, {timestamps: {createdAt: 't', updatedAt: 't'}});

let ExerciseSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    userID: {type: Schema.Types.ObjectId, required: true},
    type: {type: String, default: 'exercise'},   //练习类型，homework作业,exercise练习，exam测试，study诱导式学习
    point: {type: Number, default: 0},  //得分
    status: {type: String, default: 'pending'}, //状态，pending进行中，finished完成
    sec_id: {type: Schema.Types.ObjectId},   //节id
    swork_id: {type: Schema.Types.ObjectId}, //学生作业ID
    q_id: {type: Schema.Types.ObjectId},     //对于诱导式问题，记录root id
    step: {type: [StepSchema], default: []},    //中间步骤
    remark: {type: String, default: ''},    //备注
}, {timestamps: 1, read: 'sp', id: false});

ExerciseSchema.plugin(BaseModel);

StepSchema.virtual('step_id').get(function () {
    return this._id.toString();
});

ExerciseSchema.virtual('e_id').get(function () {
    return this._id.toString();
});

ExerciseSchema.index({userID: 1});
ExerciseSchema.index({sec_id: 1});
ExerciseSchema.index({q_id: 1});
ExerciseSchema.index({createdAt: -1});
ExerciseSchema.index({updatedAt: -1});

mongoose.model('StudyExercise', ExerciseSchema, 'studyExercise');

