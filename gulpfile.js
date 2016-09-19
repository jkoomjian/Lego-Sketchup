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
  var jsFiles = ['env.js', "lego_space.js", 'plane.js', 'lego.js',
                  'mouse_path.js', 'utils.js',
                  'events.js', 'drag.js', 'transform.js'];
  var jsPaths = jsFiles.map( f => 'src/js/' + f);
  var allJs = jsPaths.slice(0);
  allJs.push('src/js/start.js');
  gulp.src(allJs)
  // .pipe(babel( {presets: ['es2015']} ))
  .pipe(concat('main.js'))
  .pipe(gulp.dest('dist'));

  gulp.src(jsPaths)
  .pipe(babel( {presets: ['es2015']} ))
  .pipe(concat('main-test.js'))
  .pipe(gulp.dest('dist'));
});

gulp.task('html', () => {
  gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['default'], () => {
  gulp.watch(['src/*.scss'], ['sass']);
  gulp.watch(['src/js/*.js'], ['js']);
  gulp.watch(['src/*.html'], ['html']);
});

gulp.task('default', ['clean', 'sass', 'js', 'html'], () => {
});