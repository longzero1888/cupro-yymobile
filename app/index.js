/**
 * Created by zhaolei on 15/7/21.
 */
'use strict';
var fs = require('fs');
var stat = fs.stat;
var win32 = process.platform === 'win32';
var s = win32 ? '\\' : '\/';
var render = require('../lib/rendertpl');
var dialogue = require('../lib/dialogue');
var toDivName = '';
var ignores = ['.gitignore', '.npmignore'];

module.exports.do = function (divName) {
    toDivName = divName || '';
    dialogue.start(run);
};

module.exports.getTpl = function () {
    return render.tpl;
};

function run(answers) {
    var tplPath = answers['tylPath'];
    // 判断tpl目录存在
    exists(tplPath, tplPathTrue, tplPathFalse);

    // tpl目录存在
    function tplPathTrue() {
        // 给path赋值
        render.path = tplPath;
        // 准备copy
        var from = __dirname.replace(/app/, 'project');
        var to = process.cwd();
        if (toDivName !== '') {
            to += s + toDivName;
        }
        // 目标目录存在就copy，不存在先创建
        exists(to, function () {
            // 目标目录存在
            copy(from, to);
        }, function () {
            // 目标目录不存在
            fs.mkdir(to, function () {
                copy(from, to);
            })
        });
    }

    // tpl目录不存在
    function tplPathFalse() {
        console.log(tplPath + ' 不存在，请重新填写');
        dialogue.start(run);
    }

    // 文件是否存在
    function exists(path, trueCallback, falseCallback) {
        fs.exists(path, function (exists) {
            // 已存在
            if (exists) {
                trueCallback();
            }
            // 不存在
            else {
                falseCallback();
            }
        });
    }

    // 复制文件
    function copy(from, to) {
        fs.readdir(from, function (err, paths) {
            if (err) {
                throw err;
            }
            paths.forEach(function (path) {
                var _from = from + s + path,
                    _to = to + s + path,
                    readable, writable;
                stat(_from, function (err, st) {
                    if (err) {
                        throw err;
                    }
                    // 判断是否为文件并且不在ignores里
                    if (st.isFile() && !isIgnore(_from)) {
                        // 创建读取流
                        readable = fs.createReadStream(_from);
                        // 创建写入流
                        writable = fs.createWriteStream(_to);
                        // 通过管道来传输流
                        readable.pipe(writable, {end: false});
                        readable.on('end', function () {
                            // 如果是html，执行renderTpl
                            if (_to.indexOf('.html') !== -1) {
                                render.renderTpl(_to);
                            }
                        });
                    }
                    // 如果是目录则递归调用自身
                    else if (st.isDirectory()) {
                        // 目标目录存在就copy，不存在先创建
                        exists(_to, function () {
                            // 目标目录存在
                            copy(_from, _to);
                        }, function () {
                            // 目标目录不存在
                            fs.mkdir(_to, function () {
                                copy(_from, _to);
                            })
                        });
                    }
                });
            });

        });
    }

    // 排除ignore的文件
    function isIgnore(path) {
        for (var i = 0, n = ignores.length; i < n; i++) {
            if (path.indexOf(ignores[i]) !== -1) {
                return true;
            }
        }
        return false;
    }
}



