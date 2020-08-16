// function defaultTask(cb){
//     console.log('测试成功');
//     cb();
    
// }
// exports.default = defaultTask

// const{series,parallel} = require('gulp');
// function fn1(cb){
//     console.log("fn1被调用了");
//     cb();
// }
// function fn2(cb){
//     console.log("fn2被调用了");
//     cb();
// }
// exports.build = fn2;
// exports.default =series(fn1,fn2)
// const {src,dest} = require('gulp');
// const ugllify = require("gulp-uglify");
// const rename = require("gulp-rename");
// const {watch} = require('gulp');

// exports.default = function(){
//     return src("src/js/*.js")
//         .pipe(ugllify())
//         .pipe(rename({extname:".min.js"}))
//         .pipe(dest("dist/js"))
// }


// watch("src/css/*",{
//     delay:2000
// },function(cb){
//     console.log("文件发生了改变");
//     cb()
// })



// 以上内容均为使用实例测试

const {src,dest,series,watch} = require('gulp');
const htmlClean = require('gulp-htmlclean');
const less= require('gulp-less');
const cleanCss= require('gulp-clean-css');
const stripDebug= require('gulp-strip-debug');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const connect = require('gulp-connect');//服务器

const folder = {
    src:'src/',
    dist:'dist/',
} 

function html(){
    return src(folder.src +"html/* ") //文件入口
    .pipe(htmlClean()) //压缩html文件
    .pipe(dest(folder.dist + "html/")) //文件出口
    .pipe(connect.reload());//实现热更新
}
function css(){
    return src(folder.src +"css/* ")
    .pipe(less())//转换less文件
    .pipe(cleanCss())//压缩less文件
    .pipe(dest(folder.dist + "css/"))
    .pipe(connect.reload());//实现热更新

}

function js(){
    return src(folder.src +"js/*")
    .pipe(stripDebug())//去掉调试语句 
    .pipe(uglify())//压缩
    .pipe(dest(folder.dist + "js/"))
    .pipe(connect.reload());//实现热更新

}

function image(){
    return src(folder.src +"image/*")
    .pipe(imagemin())
    .pipe(dest(folder.dist + "image/"))
}

function server(cb){
    connect.server({
        port:'1573',//端口
        livereload:true //自动刷新
    });
    cb();//没有return 故需要一个回调函数

}


watch(folder.src + "html/*",function(cb){//监听任务 会自动调用更改的文件 进行刷新
    html();
    cb();
});
watch(folder.src + "css/*",function(cb){
    css();
    cb();
});
watch(folder.src + "js/*",function(cb){
    js();
    cb();
});

exports.default = series(html,css,js,image,server);