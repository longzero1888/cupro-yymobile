/**
 * Created by zhaolei on 15/7/21.
 */
'use strict';
var fs = require('fs');
var stat = fs.stat;
var win32 = process.platform === 'win32';
var s = win32 ? '\\' : '\/';

var App = module.exports = function App(divName) {
    var toDivName = divName || '';
    var from = __dirname.replace(/app/, 'project');
    var to = process.cwd()
    if(toDivName!==''){
        to += s + toDivName;
    }
    exists(from, to, copy);

};

function copy(src, dst) {
    // 读取目录中的所有文件/目录
    fs.readdir(src, function (err, paths) {
        if (err) {
            throw err;
        }
        paths.forEach(function (path) {
            var _src = src + s + path,
                _dst = dst + s + path,
                readable, writable;
            stat(_src, function (err, st) {
                if (err) {
                    throw err;
                }
                // 判断是否为文件
                if (st.isFile()) {
                    // 创建读取流
                    readable = fs.createReadStream(_src);
                    // 创建写入流
                    writable = fs.createWriteStream(_dst);
                    // 通过管道来传输流
                    readable.pipe(writable, {end: false});
                    readable.on('end', function () {
                        renderTpl(_dst);
                    });
                }
                // 如果是目录则递归调用自身
                else if (st.isDirectory()) {
                    exists(_src, _dst, copy);
                }
            });
        });

    });
}
// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
function exists(src, dst, callback) {
    fs.exists(dst, function (exists) {
        // 已存在
        if (exists) {
            callback(src, dst);
        }
        // 不存在
        else {
            fs.mkdir(dst, function () {
                callback(src, dst);
            });
        }
    });
}


function renderTpl(dst) {
    fs.readFile(dst,'utf-8', function (err, data) {
        var html = data.replace(/\{\%header\%\}/g, '<h1>替换成功啊</h1>');
        fs.writeFile(dst, html, function () {
            console.log(dst);
            console.log('!!!replace success!!!');
        })
    })
}