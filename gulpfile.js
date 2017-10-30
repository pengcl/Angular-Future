var gulp = require('gulp');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var ngHtml2Js = require("gulp-ng-html2js");
var minifyHtml = require("gulp-minify-html");
var replace = require('gulp-replace');

var version = "1.0.0";

//定义css、js文件路径，是本地css,js文件的路径，可自行配置

var config = {
    app: {
        sass: 'app/**/*.scss',
        js: 'app/**/*.js',
        html: 'app/*/**/*.html',
        images: ['app/**/*.jpg', 'app/**/*.png'],
        index: 'app/index.html',
        test: 'test/',
        prod: 'prod/'
    },
    rev: {
        sass: 'rev/**/*.scss',
        js: 'rev/**/*.js',
        html: 'rev/**/*.html',
        images: ['rev/**/*.jpg', 'app/**/*.png'],
        json: 'rev/json/'
    },
    api: {
        prodApi: "http://api.yfq.cn",
        testApi: "http://testApi.yfq.cn"
    }
};

/* clean start 清空文件夹，避免资源冗余 */
gulp.task('clean', function () {
    return gulp.src(['dist', 'test', 'rev'], {read: false}).pipe(clean());
});
/* clean end */

gulp.task('images', function () {
    return gulp.src(config.app.images)
        .pipe(imagemin())
        .pipe(rev())
        .pipe(gulp.dest(config.app.test))
        .pipe(gulp.dest(config.app.prod))
        .pipe(rev.manifest({merge: true}))
        .pipe(gulp.dest(config.rev.json + 'images'));
});

//CSS里更新引入文件版本号
gulp.task('revSass', function () {
    return gulp.src(['rev/**/*.json', config.app.sass])
        .pipe(revCollector())
        .pipe(gulp.dest('rev/'));
});

gulp.task('revHtml', function () {
    return gulp.src(['rev/**/*.json', config.app.html])
        .pipe(revCollector())
        .pipe(gulp.dest('rev/'));
});

gulp.task('sass', function () {
    return gulp.src(config.rev.sass)
        .pipe(autoprefixer())
        .pipe(sass())
        .pipe(concat("app.css"))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifyCSS())
        .pipe(rev())
        .pipe(gulp.dest(config.app.test))
        .pipe(gulp.dest(config.app.prod))
        .pipe(rev.manifest({merge: true}))
        .pipe(gulp.dest(config.rev.json + 'sass'));
});

gulp.task('html', function () {
    return gulp.src(config.rev.html)
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(ngHtml2Js({
            moduleName: "appTpl"
        }))
        .pipe(concat("app.tpl.js"))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(config.app.test))
        .pipe(gulp.dest(config.app.prod))
        .pipe(rev.manifest({merge: true}))
        .pipe(gulp.dest(config.rev.json + 'html'));
});

/* static_js start 静态资源js类 */
gulp.task('js', function () {
    return gulp.src(config.app.js)
        .pipe(concat('app.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest(config.app.test))
        .pipe(gulp.dest(config.app.prod))
        .pipe(rev.manifest({merge: true}))
        .pipe(gulp.dest(config.rev.json + 'js'));
});
/* statics end */

gulp.task('index', function () {
    return gulp.src(['rev/**/*.json', config.app.index])
        .pipe(revCollector())
        .pipe(replace(/apiHost: \"(.*?)\"/, 'apiHost: ' + '"' + config.api.prodApi + '"'))
        .pipe(gulp.dest(config.app.prod))
        .pipe(replace(/apiHost: \"(.*?)\"/, 'apiHost: ' + '"' + config.api.testApi + '"'))
        .pipe(gulp.dest(config.app.test));
});

//开发构建
gulp.task('dev', function (done) {
    condition = false;
    runSequence(//同步任务
        ['clean'],
        ['images'],
        ['js'],
        ['revHtml'],
        ['revSass'],
        ['html'],
        ['sass'],
        ['index'],
        done);
});

gulp.task('watch', function () {
    gulp.watch(
        [
            config.app.images,
            config.app.sass,
            config.app.html,
            config.app.js,
            config.app.index
        ],
        [
            'images',
            'sass',
            'html',
            'js',
            'index'
        ]
    );
});

gulp.task('default', ['dev']);