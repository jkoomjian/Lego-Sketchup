"use strict";

const gulp = require("gulp");
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const del = require('del');
const concat = require('gulp-concat');

gulp.task('clean', () => {
  del.sync('dist');
});

gulp.task('sass', () => {
  gulp.src('src/style.scss')
      .pipe(sass())
      .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
      .pipe(gulp.dest('dist'));
});

gulp.task('js', () => {
  gulp.src(['src/js/main.js', "src/js/lego-space.js", 'src/js/planes.js', 'src/js/lego.js',
            'src/js/events.js', 'src/js/drag.js', 'src/js/transform.js', 'src/js/start.js'])
  .pipe(babel( {presets: ['es2015']} ))
  .pipe(concat('main.js'))
  .pipe(gulp.dest('dist'));

  gulp.src(['src/js/main.js', "src/js/lego-space.js", 'src/js/planes.js', 'src/js/lego.js',
            'src/js/events.js', 'src/js/drag.js', 'src/js/transform.js', 'src/js/start.js'])
  .pipe(babel( {presets: ['es2015']} ))
  .pipe(concat('main-test.js'))
  .pipe(gulp.dest('dist'));
});

gulp.task('html', () => {
  gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', () => {
  gulp.watch(['src/*.scss'], ['sass']);
  gulp.watch(['src/js/*.js'], ['js']);
  gulp.watch(['src/*.html'], ['html']);
});

gulp.task('default', ['clean', 'sass', 'js', 'html'], () => {
});