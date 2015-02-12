var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    jade = require('jade'),
    gulpJade = require('gulp-jade'),
    imageop = require('gulp-image-optimization'),
    connect = require('gulp-connect'),
    opn = require('opn'),
    less = require('gulp-less'),
    livereload = require('gulp-livereload');

gulp.task('connect', function () {
    connect.server({
        root: '',
        livereload: true
    });
    opn('http://localhost:8080');
});


gulp.task('less', function () {
  return gulp.src(['src/vendor/reset.css', 'src/fonts/fonts.css', 'src/less/style.less'])
    .pipe(less())
    .pipe(concat('style.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(cssmin())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(connect.reload());
});

gulp.task('scripts', function () {
    return gulp.src('src/js/*.js')
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(uglify())
        .pipe(rename('scripts.min.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(connect.reload());
});

gulp.task('jade', function () {
    return gulp.src('src/jade/index.jade')
        .pipe(gulpJade({
            jade: jade,
            pretty: true
        }))
        .pipe(gulp.dest(''))
        .pipe(connect.reload());
});

gulp.task('images', function (cb) {
    gulp.src(['src/img/**/*.png', 'src/img/**/*.jpg', 'src/img/**/*.gif', 'src/img/**/*.jpeg']).pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })).pipe(gulp.dest('dist/img')).on('end', cb).on('error', cb);
});

// Действия по умолчанию
gulp.task('default', function () {
    // gulp.run('jade', 'less', 'scripts', 'watch');
    // gulp.run('lr-server', 'jade', 'less', 'scripts');
    gulp.run('jade', 'less', 'scripts', 'connect');
    gulp.watch(["src/less/*.less"], function (event) {
        gulp.run('less');
    });
    gulp.watch(["src/js/*.js"], function (event) {
        gulp.run('scripts');
    });
    gulp.watch(["src/jade/*.jade"], function (event) {
        gulp.run('jade');
    });
});