var gulp = require('gulp');//
const del = require('del');
var pug = require('gulp-pug');
const typescript = require('gulp-typescript');
var changed = require('gulp-changed');//
var sass = require('gulp-sass');//
var postcss    = require('gulp-postcss');//
var sourcemaps = require('gulp-sourcemaps');

gulp.task('pug', function () {
  return gulp.src('src/**/*.pug')
    .pipe(changed('src', {extension: '.html'}))
    .pipe(pug())
    .pipe(gulp.dest('src'))
});

gulp.task('style', function () {
  return gulp.src('src/**/*.sass')
    .pipe(changed('src',{extension: '.css'}))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe( postcss([ require('autoprefixer')] ))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('src'));
});


gulp.task('serve', ['style', 'pug'], function() {
  gulp.watch("src/**/*.sass", ['style']);
  gulp.watch("src/**/*.pug", ['pug']);
});

// TypeScript compile
gulp.task('compile', ['clean'], function () {
    return gulp
        .src('app/**/*.ts')
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(gulp.dest('dist/app'));
});

gulp.task('default', ['serve']);
// gulp.task('build', ['style', 'pug', 'compile']);
// gulp.task('default', ['build']);