//有**标识的请不要更改

//设置JS和CSS打包规则，例子是将/css/reset.css和/css/normalize.css合并打包成一个css，位置为/css/base.css
fis.config.set('pack', {
    '/css/base.css': [
        '/css/reset.css'
    ],
    '/js/base.js':[
        '/js/main.js'
    ]
});
//设置csssprites的合并间距
fis.config.set('settings.spriter.csssprites', {
//    scale: 0.5,//移动端retina开启
    margin : 20
})

//**开启打包资源替换
fis.config.set('modules.postpackager', 'simple');

//**设置路径，千万不要修改以下内容
var os = require('os');
var dirname = __dirname;
var dirnameArr;
if(os.platform() == 'win32' || os.platform() == 'win64'){
    dirnameArr = dirname.split('\\');
}else{
    dirnameArr = dirname.split('/');
}
dirnameArr.reverse();
fis.config.merge({
    roadmap : {
        path : [
            {
                //所有的others文件
                reg : /.*\/others\/.*/,
                //发布的时候即使加了--md5参数也不要生成带md5戳的文件
                useHash : false,
                release : '/zt/'+dirnameArr[1]+'/'+dirnameArr[0]+'$&'
            },
            {
                reg : /(.*\.css)/,
                useSprite: true,
                release : '/zt/'+dirnameArr[1]+'/'+dirnameArr[0]+'/$1'
            },
            {
                reg : /(.*)/,
                release : '/zt/'+dirnameArr[1]+'/'+dirnameArr[0]+'/$1'
            }
        ],
        domain : [
            //'webmap0.map.bdimg.com',
            //'webmap1.map.bdimg.com',
            //'webmap2.map.bdimg.com',
            //'webmap3.map.bdimg.com',
            //'webmap4.map.bdimg.com',
            // 'http://s0.map.bdimg.com'
            'https://webmap0.bdimg.com'
        ]
    }
});
