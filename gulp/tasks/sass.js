var colors = require('colors');
var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var livereload = require('gulp-livereload');

gulp.task('sass', function(){

  var files = ['frontend/**/*.sass', '!frontend/**/_*.sass'];

  console.log(colors.cyan("Compiling sass"));

  return gulp.src(files, {base: "source"})
  .pipe(sass({
    errLogToConsole: true,
    sourceComments: 'normal'
  }))
  .on('error', function(error){
    console.log(error.message); 
  })
  .pipe(rename(function(path){
    
    path.dirname = path.dirname.replace("sass", "css");
    // Renames output .sass file with timestamp (cache-bust)
    // path.basename += "." + currDate;
  }))
  .pipe(gulp.dest('source'))
  .pipe(livereload({silent: true}));

});
