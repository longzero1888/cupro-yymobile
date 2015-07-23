/**
 * Created by baidu on 15/7/23.
 */
'use strict';
var inquirer = require('inquirer');
function Dialogue(){
    // 所有问题
    this.prompts= [{
        type: 'input',
        name: 'tylPath',
        message: '请输入tpl的目录: ',
        'default': '../tpl'
    }];
}
Dialogue.prototype.start = function (callback) {
    inquirer.prompt(this.prompts, function (answers) {
        callback(answers);
    });
};
module.exports = new Dialogue();