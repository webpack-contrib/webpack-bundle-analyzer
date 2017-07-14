const { resolve, relative } = require('path');

const gulp = require('gulp');
const gutil = require('gulp-util');
const { white, cyan } = gutil.colors;

const NODE_SRC = ['src/**/*.js'];
const NODE_DEST = resolve('lib');

const cli = require('commander')
  .usage('<task> [options]')
  .option('-e, --env <environment>', 'Can be `prod` or `dev`. Default is `dev`', /^(dev|prod)$/, 'dev')
  .option('-a, --analyze', 'Analyze client bundle. If set, `env` will be set to `prod`.')
  .parse(process.argv);

if (cli.args[0] === 'build' || cli.analyze) {
  cli.env = 'prod';
}

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

gulp.task('build', ['scripts.viewer', 'scripts.node']);

gulp.task('scripts.viewer', ['scripts.node', 'clean.scripts.viewer'], () => {
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
});

gulp.task('clean.scripts.viewer', () => {
  const del = require('del');
  return del('public');
});

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
