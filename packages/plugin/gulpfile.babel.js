const { resolve, relative } = require('path');

const gulp = require('gulp');
const gutil = require('gulp-util');
const { white, cyan } = gutil.colors;

const NODE_SRC = ['src/**/*.js'];
const NODE_DEST = resolve('lib');

gulp.task('default', ['watch']);

gulp.task('watch', ['build'], () => {
  const watch = require('gulp-watch');
  const plumber = require('gulp-plumber');
  const del = require('del');

  gulp.watch('.babelrc', ['build']);

  return watch(NODE_SRC, file => {
    const { event } = file;

    if (event === 'add' || event === 'change') {
      gutil.log(
        `${white('[Watcher]')} Compiling '${cyan(getProjectPath(file.path))}' as it was ` +
        `${cyan(event === 'change' ? 'changed' : 'added')}...`
      );
      gulp
        .src(file.path, { base: 'src' })
        .pipe(plumber())
        .pipe(nodeScriptsCompiler());
    }

    if (event === 'unlink') {
      const compiledScriptPath = resolve(NODE_DEST, file.relative);
      gutil.log(
        `${white('[Watcher]')} Deleting compiled file '${cyan(getProjectPath(compiledScriptPath))}' ` +
        "as it's source was deleted..."
      );
      del.sync(compiledScriptPath);
    }
  });
});

gulp.task('build', ['scripts.node']);

gulp.task('scripts.node', ['clean.scripts.node'], () =>
  gulp
    .src(NODE_SRC)
    .pipe(nodeScriptsCompiler())
);

gulp.task('clean.scripts.node', () => {
  const del = require('del');
  return del(NODE_DEST);
});

function nodeScriptsCompiler() {
  const combine = require('stream-combiner2').obj;
  const babel = require('gulp-babel');

  return combine([
    babel(),
    gulp.dest(NODE_DEST)
  ]);
}

function getProjectPath(absolutePath) {
  return relative(__dirname, absolutePath);
}
