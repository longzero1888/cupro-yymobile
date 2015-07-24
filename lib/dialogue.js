/**
 * Created by baidu on 15/7/23.
 */
'use strict';
var inquirer = require('inquirer');
function Dialogue() {
    // 问题
    this.prompts = [{
        type: 'confirm',
        name: 'yes',
        message: '是否需要tpl模板渲染？'
    },{
        type: 'input',
        name: 'path',
        message: '请输入tpl的目录:',
        default: '../tpl',
        when: function (answers) {
            return answers.yes;
        }
    }];

}
Dialogue.prototype.start = function (callback) {
    var self = this;
    inquirer.prompt(self.prompts, function (answers) {
        callback(answers);
    });
};
module.exports = new Dialogue();