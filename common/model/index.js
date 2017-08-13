/**
 * Created by MengLei on 2016-08-26.
 */
"use strict";
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const config = require('../../config').db;

mongoose.connect(config.base + config.path, err=> {
    if (err) {
        console.error(`connect to mongodb error: ${err.message}`);
        process.exit(1);
    }
});
mongoose.Promise = require('bluebird');
let byConn = mongoose.createConnection(config.base + config.user_path);
exports.byConn = byConn;

walkdir(__dirname).forEach(item=> {
    if (path.extname(item) == '.js' && path.basename(item) != 'index.js' && path.basename(item) != 'baseModel.js') {
        require(item);
    }
});

//export两个数据库下的所有model
module.exports = Object.assign({}, mongoose.models, byConn.models);

//遍历指定路径
function walkdir(pa) {
    pa = path.resolve(pa);
    let list = [];
    walk(pa);
    function walk(pa) {
        let s = fs.lstatSync(pa);
        if (!s.isDirectory()) {
            return list.push(pa);
        }
        fs.readdirSync(pa).forEach(item=> {
            walk(path.join(pa, item));
        });
    }

    return list;
}
