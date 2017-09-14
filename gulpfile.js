var gulp = require('gulp');
var webpack = require('webpack-stream');

gulp.task('default', ['static_libs', 'html', 'js']);

gulp.task('js', function() {
  return gulp.src('src/main.js')
    .pipe(webpack( require('./webpack.config.js') ))
    .on('error', function(error) {
      console.error(error);
      this.emit('end');
    })
    .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function() {
  gulp.watch(['src/*.vue', 'src/*.js', 'common/*.js'], ['js']);
  gulp.watch('src/**/*.html', ['html']);
});

gulp.task('html', function() {
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist/'));
});

gulp.task('static_libs', ['install_chessboardjs_imgs'], function() {
  return gulp.src('static_libs/**')
    .pipe(gulp.dest('dist/static_libs'));
});

gulp.task('install_chessboardjs_imgs', function() {
  return gulp.src('static_libs/chessboardjs-0.3.0/img/**')
    .pipe(gulp.dest('dist/img'));
});
