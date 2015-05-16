var gulp = require('gulp');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var livereload = require('gulp-livereload');

gulp.task('scss', function() {
  gulp.src('./frontend/root/scss/{,**/}*.{scss,sass}')
  .pipe(sass({
    errLogToConsole: true,
    // outputStyle: 'compressed'
  }))
  .pipe(prefix("last 3 version", "> 1%", "ie 8"))
  .pipe(gulp.dest('./frontend/root/css'))
  .pipe(livereload({silent: true}));
})