var colors = require('colors');
var gulp  = require('gulp');

gulp.task('watch', ['sass'], function(){

  gulp.watch('frontend/**/*.sass', ['sass']);

});