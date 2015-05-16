var colors = require('colors');
var gulp  = require('gulp');

gulp.task('watch', ['scss'], function(){

  gulp.watch('frontend/**/*.scss', ['scss']);

});