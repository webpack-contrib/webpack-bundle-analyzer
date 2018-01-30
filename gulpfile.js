'use strict';

const gulp = require('gulp');

const NODE_SRC = './src/**/*.js';
const NODE_DEST = './lib';

const cli = require('commander')
  .usage('<task> [options]')
  .option('-e, --env <environment>', 'Can be `prod` or `dev`. Default is `dev`', /^(dev|prod)$/, 'dev')
  .option('-a, --analyze', 'Analyze client bundle. If set, `env` will be set to `prod`.')
  .parse(process.argv);

let watching = false;
const task = cli.args[0] || 'watch';
if (task === 'build' || cli.analyze) {
  cli.env = 'prod';
}

gulp.task('clean', gulp.parallel(cleanNodeScripts, cleanViewerScripts));
gulp.task('build', gulp.series('clean', compileNodeScripts, compileViewerScripts));
gulp.task('watch', gulp.series('build', watch));
gulp.task('default', gulp.task('watch'));

function watch() {
  watching = true;
  gulp.watch(NODE_SRC, gulp.series(cleanNodeScripts, compileNodeScripts));
}

function cleanViewerScripts() {
  const del = require('del');
  return del('public');
}

function cleanNodeScripts() {
  const del = require('del');
  return del(NODE_DEST);
}

function compileNodeScripts() {
  const babel = require('gulp-babel');
  const plumber = require('gulp-plumber');
  const noop = require('gulp-noop');

  return gulp
    .src(NODE_SRC)
    .pipe(watching ? plumber() : noop())
    .pipe(babel())
    .pipe(gulp.dest(NODE_DEST));
}

function compileViewerScripts() {
  const webpack = require('webpack');
  const config = require('./webpack.config')({
    env: cli.env,
    analyze: cli.analyze
  });

  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (cli.env === 'dev') {
        if (err) {
          console.error(err);
        } else {
          console.log(stats.toString({ colors: true }));
        }
        resolve();
      } else {
        if (err) return reject(err);
        console.log(stats.toString({ colors: true }));
        resolve();
      }
    });
  });
}
