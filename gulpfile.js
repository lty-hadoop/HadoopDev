var gulp = require("gulp");
var $ = require("gulp-load-plugins")();

//1. 启动本地服务
var webserver = require("gulp-webserver");
// mock数据 模拟   json数据
gulp.task("webserver",function(){
    gulp.src("./")      //表示当前文件夹
        .pipe(webserver({
            livereload:true,    // 浏览器自动刷新，更新数据，类似热替换
            port:8080,          // 自定义端口号
            host:"test",    // 主机,可以更换成电脑IP
            directoryListing:{   // 要不要在浏览器中显示你开发环境得项目目录,便于开发使用，如果上线，就必须设置为false
                enable:true ,     //true 显示 默认false
                path:"./"         //作用的文件目录范围
            }
        }))
});

//监听
gulp.task("watch",function(){
    gulp.watch("hadoopDev/html",["html"]);
    gulp.watch("hadoopDev/js/**",["js"]);
    gulp.watch("hadoopDev/css",["css"]);
    gulp.watch("hadoopDev",["html"]);

});
gulp.task("default",["webserver","watch"],function(){

});