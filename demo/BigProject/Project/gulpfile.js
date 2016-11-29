var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');

var paths = {
    sass: ['./scss/**/*.scss', './scss/*.scss'],
    css: ['vendor/angular-material/angular-material.min.css',
        'vendor/bootstrap/bootstrap.min.css',
        'vendor/bootstrap-table/bootstrap-table.min.css'],
    js: [
        './js/**/*.js',
        //'!./js/*/*.js',
        //'!./js/app.js',
        '!./js/config.js',
        //'!./js/svgcache.js',
        //'!./js/common.js',
        //'!./js/filter.js',
        //'!./js/directive.js',
        //'!./js/backend.js'
        //'!./js/main/Controller.js'
        ],
    all: ['./**/*', './lib/', '!./*.*', '!./node_modules/**/'],
    libJs: [
        'vendor/jquery/jquery.min.js',
        'vendor/bootstrap/bootstrap.min.js',
        'vendor/angular/angular.min.js',
        'vendor/angular/i18n/angular-locale_zh-cn.js',
        'vendor/angular/angular-animate.min.js',
        'vendor/angular/angular-aria.min.js',
        'vendor/angular/angular-cookies.min.js',
        'vendor/angular/angular-route.min.js',
        'vendor/angular/angular-resource.min.js',
        'vendor/angular-material/angular-material.min.js',
        'vendor/angular-messages/angular-messages.min.js',
        'vendor/angular-ui/angular-ui-router.min.js',
        'vendor/bootstrap-table/bootstrap-table.min.js',
        'vendor/bootstrap-table/locale/bootstrap-table-zh-CN.min.js',
        'vendor/bootstrap-table/bootstrap-table-angular.js',
		'vendor/E-charts/echarts.common.min.js',
        'vendor/moment/moment.min.js'
    ]
};
var version;

gulp.task('default', ['sass', 'minjs', 'minLibJs'], function (done) {
    runSequence('watch', done);
});

gulp.task('dist', function (done) {
    runSequence('sass', 'minjs', 'minLibJs', 'setVersion', done);
});

gulp.task('test', function (done) {
    runSequence('sass', 'minjs', 'minLibJs', 'setVersion', 'config-test', done);
});

gulp.task('master', function (done) {
    runSequence('sass', 'minjs', 'minLibJs', 'setVersion', 'config-master', done);
});

gulp.task('release', function (done) {
    runSequence('sass', 'minjs', 'minLibJs', 'setVersion', 'config-release', done);
});

gulp.task('setVersion', function () {
    var date = new Date();
    version = date.getTime();
});

gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.js, ['minjs']);
});

gulp.task('sass', ['cleanCss', 'minCss'], function (done) {
    gulp.src('./scss/recon.all.scss')
        .pipe(sass())
        .pipe(gulp.dest('./distCss/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest('./distCss/'))
        .on('end', done);
});

gulp.task('cleanCss', function () {
    return gulp.src(['distCss/all.css'], {read: false}).pipe(clean());
});

// 压缩lib的css
gulp.task('minCss', function (done) {
    gulp.src(paths.css)
        .pipe(concat('all.css'))
        .pipe(gulp.dest('./distCss/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest('./distCss/'))
        .on('end', done);
});

gulp.task('minjs', ['cleanJs'], function (done) {
    // 源地址
    gulp.src(paths.js)
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./distJS/'))
        // 压缩
        .pipe(uglify({
            // 保留部分注释
            preserveComments: 'some'
        }))
        // 重命名
        .pipe(rename({
            // 文件后缀
            extname: '.min.js'
        }))
        // 目标地址
        .pipe(gulp.dest('./distJS/'))
        .on('end', done);
});

// 压缩lib的js
gulp.task('minLibJs', function (done) {
    // 源地址
    gulp.src(paths.libJs)
        .pipe(concat('lib.all.js'))
        .pipe(gulp.dest('./distJS/'))
        // 压缩
        .pipe(uglify({
            // 保留部分注释
            preserveComments: 'some'
        }))
        // 重命名
        .pipe(rename({
            // 文件后缀
            extname: '.min.js'
        }))
        // 目标地址
        .pipe(gulp.dest('./distJS/'))
        .on('end', done);
});

gulp.task('cleanJs', function () {
    return gulp.src(['distJS/all.js', 'distJS/all.min.js'], {read: false}).pipe(clean());
});

gulp.task('config-test', function () {
    gulp.src(['./config/config-test.js'])
        .pipe(concat('config.js'))
        .pipe(gulp.dest('./js'))
        .pipe(uglify({
            mangle: false,
            preserveComments: 'some'
        }));
});

gulp.task('config-master', function () {
    gulp.src(['./config/config-master.js'])
        .pipe(concat('config.js'))
        .pipe(gulp.dest('./js'))
        .pipe(uglify({
            mangle: false,
            preserveComments: 'some'
        }));
});

gulp.task('config-release', function () {
    gulp.src(['./config/config-release.js'])
        .pipe(concat('config.js'))
        .pipe(gulp.dest('./js'))
        .pipe(uglify({
            mangle: false,
            preserveComments: 'some'
        }));
});