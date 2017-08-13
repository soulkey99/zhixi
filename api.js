/**
 * this script is used for compiling raw markdown api docs into formatted html and upload to server
 * Created by MengLei on 2016-10-11.
 */
"use strict";
const spawn = require('child_process').spawnSync;
process.chdir('../byzhixi.wiki');

spawn('mkdocs', ['build', '--clean'], {stdio: 'inherit'});

sftpupload();

function sftpupload() {
    process.chdir(__dirname);
    var Sftp = require('sftp-upload'),
        fs = require('fs');

    var options = {
            host: '',
            username: '',
            path: './public/api',
            remoteDir: '/byzhixi/public/api',
            privateKey: fs.readFileSync('')
        },
        sftp = new Sftp(options);

    sftp.on('error', function (err) {
        console.log(`[sftp] error: ${err.message}`);
    }).on('uploading', function (pgs) {
        console.log(`[sftp] Uploading: ${pgs.file}, ${pgs.percent}% completed`);
    }).on('completed', function () {
        console.log('[sftp] Upload Completed');
    }).upload();
}
