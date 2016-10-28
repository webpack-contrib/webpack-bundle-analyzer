require('babel-polyfill');

const { resolve, relative } = require('path');

const gulp = require('gulp');
const gutil = require('gulp-util');
const { white, cyan } = gutil.colors;

const SRC = ['src/**/*.js'];
const DEST = resolve('lib');

gulp.task('default', ['watch']);

gulp.task('watch', ['build'], function () {
  const watch = require('gulp-watch');
  const plumber = require('gulp-plumber');
  const del = require('del');

  gulp.watch('.babelrc', ['build']);

  return watch(SRC, file => {
    const { event } = file;

    if (event === 'add' || event === 'change') {
      gutil.log(
        `${white('[Watcher]')} Compiling '${cyan(getProjectPath(file.path))}' as it was ` +
        `${cyan(event === 'change' ? 'changed' : 'added')}...`
      );
      gulp
        .src(file.path, { base: 'src' })
        .pipe(plumber())
        .pipe(compileScripts());
    }

    if (event === 'unlink') {
      const compiledScriptPath = resolve(DEST, file.relative);
      gutil.log(
        `${white('[Watcher]')} Deleting compiled file '${cyan(getProjectPath(compiledScriptPath))}' ` +
        "as it's source was deleted..."
      );
      del.sync(compiledScriptPath);
    }
  });
});

gulp.task('clean', function () {
  const del = require('del');
  return del('lib');
});

gulp.task('build', ['clean'], function () {
  return gulp.src(SRC)
    .pipe(compileScripts());
});

function compileScripts() {
  const combine = require('stream-combiner2').obj;
  const babel = require('gulp-babel');

  return combine([
    babel(),
    gulp.dest(DEST)
  ]);
}

function getProjectPath(absolutePath) {
  return relative(__dirname, absolutePath);
}
