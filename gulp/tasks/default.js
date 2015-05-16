var gulp = require('gulp');
var livereload = require('gulp-livereload');

gulp.task('default', ['scss'], function () {
  livereload.listen();
  gulp.watch('./frontend/root/scss/{,**/}*.{scss,sass}', ['scss'])
});