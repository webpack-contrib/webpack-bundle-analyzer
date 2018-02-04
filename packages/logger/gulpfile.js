'use strict';

const gulp = require('gulp');

const NODE_SRC = './src/**/*.js';
const NODE_DEST = './lib';

gulp.task('clean', gulp.parallel(cleanNodeScripts));
gulp.task('build', gulp.series('clean', compileNodeScripts));
gulp.task('watch', gulp.series('build', watch));
gulp.task('default', gulp.task('watch'));

function watch() {
  gulp
    .watch(NODE_SRC, gulp.series(cleanNodeScripts, compileNodeScripts))
    // TODO: replace with `emitErrors: false` option after https://github.com/gulpjs/glob-watcher/pull/34 will be merged
    .on('error', () => {});
}

function cleanNodeScripts() {
  const del = require('del');
  return del(NODE_DEST);
}

function compileNodeScripts() {
  const babel = require('gulp-babel');

  return gulp
    .src(NODE_SRC)
    .pipe(babel())
    .pipe(gulp.dest(NODE_DEST));
}
