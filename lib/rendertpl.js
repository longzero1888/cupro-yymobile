/**
 * Created by baidu on 15/7/23.
 */
'use strict';
var fs = require('fs');
var win32 = process.platform === 'win32';
var s = win32 ? '\\' : '\/';
function Render() {
    // tpl的path
    this.path = '';
    this.namespace = 'yymobile';
    this.tpl = {
        'meta': 'meta.tpl',
        'link': 'link.tpl',
        'headScript': 'headscript.tpl',
        'bodyScript': 'bodyscript.tpl'
    };
}
Render.prototype.renderTpl = function (path) {
    var self = this;
    // 读取需要渲染的文件
    fs.readFile(path, 'utf-8', function (err, data) {
        var html = data;
        // 循环tpl
        for (var i in self.tpl) {
            var nowPath = self.path + s + self.namespace + s + self.tpl[i];
            // 寻找对应的tpl是否存在
            var exists = fs.existsSync(nowPath);
            var tpl = '';
            // 存在的话，读取文件
            if(exists){
                tpl = fs.readFileSync(nowPath, 'utf-8');
            }
            // 执行替换
            html = self.replace(html, i, tpl);
        }
        // 写回需要渲染的文件
        fs.writeFile(path, html, 'utf-8', function (err) {
            if (err) throw err;
            console.log('success!');
        })
    });
};

Render.prototype.replace = function (data, from, to) {
    // 暂定<%XXX%>
    return data.replace('<%' + from + '%>', to);
};

module.exports = new Render();