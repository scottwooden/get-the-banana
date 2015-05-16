/* Require gulp and plugins */

var fs = require('fs'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
bower = require('bower'),
gulp = require('gulp'),
sass = require('gulp-ruby-sass'),
glob = require("glob"),
rename = require("gulp-rename"),
livereload = require('gulp-livereload'),
lr = require('tiny-lr'),
clean = require('gulp-clean'),
server = lr(),
fontsmith = require('fontsmith'),
_ = require('underscore'),
exec = require('child_process').exec;


/* Require config */

var package = require('./package.json'),
config = package.config,
output = package.output;

eval(fs.readFileSync("source/js/app/config.js")+'');

/* Cache current timestamp to be used for cache-busting/filenames */
var currDate = new Date().getTime();

gulp.task('fonts', ['clean'], function(){

  return gulp.src(['source/fonts/**'])
  .pipe(gulp.dest('www/fonts'));

});

gulp.task('icons', function(){

  var fontFilename = 'icons',
  templateFilename = 'scss.template',
  compiledPath = 'source/styles/sass/_icons.scss',
  path = 'source/fonts/icons/',
  src = 'source/fonts/icons/src/';

  glob(src + '*.svg', null, function (err, files) {
    
    var svgs = files;

    console.log('Generating icon fonts for', svgs.length, '.svg(s)');

    fontsmith({src: svgs}, function (err, res) {
      // res.map; - Map of file name to unicode value for character (e.g. {'icon-name': 57344})
      // res.fonts; - Object containing binary string representations of fonts (e.g. {svg, ttf, woff, eot})

      if (err) return;

      _.each(res.fonts, function (binary, format) {
        var buff = new Buffer(binary, 'binary');
        var fd = fs.openSync(path + fontFilename + '.' + format, 'w');

        fs.write(fd, buff, 0, buff.length, 0, null);
      });

      var template = _.template(fs.readFileSync(src + templateFilename).toString('utf8'));
      var compiled = template({classes: res.map});

      fs.writeFile(compiledPath, compiled, function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log('Generated', compiledPath);
        }
      }); 

    });

  });

});

gulp.task('data', ['clean'], function(){

  return gulp.src(['source/data/**'])
  .pipe(gulp.dest('www/data'));

});

gulp.task('images', ['clean'], function(){

  return gulp.src(['source/images/**', '!source/images/icons/**/*.ai'])
  .pipe(gulp.dest('www/images'));

});

gulp.task('compress-png', function(callback){

  var child = exec("find www/images -name *.png | xargs optipng -o7 -sim");

  child.stderr.on("data", function(data){
    var logs = data.match(/^.*png.*$/mg, "");
    if(logs){
      logs.forEach(function(item){
        console.log(item + "\n");
      });
    }
  });

  child.on("close", function(code){
    if(code){
      console.log("\nError! Make sure optipng is installed before running task.\n");
      console.log("To install with homebrew run:\n\tbrew install optipng\n");
    } else {
      console.log("Successfully compressed pngs");
    }
    callback();
  });

});

gulp.task('rootfiles', ['clean'], function(){

  return gulp.src(['source/**.*', "!source/**.html", "!source/bower.json"])
  .pipe(gulp.dest('www/'));

});

/* sass task to compile sass files ('gulp sass') */
gulp.task('css', ['clean', 'sass'], function() {

  return gulp.src(['source/styles/lib/**/*'])
    .pipe(uglify({compress: true}))
    .pipe(gulp.dest('www/css/lib'));

});

gulp.task('bootstrapped-scripts', ['clean'], function(){

  gulp.src(['source/js/app/init.js'])
    .pipe(uglify({compress: true}))
    .pipe(gulp.dest("www/js/app/"));

  gulp.src(['source/js/app/config.js'])
    .pipe(uglify({compress: true}))
    .pipe(gulp.dest("www/js/app/"));

  gulp.src(['source/js/lib/bower/createjs-preloadjs/lib/preloadjs-0.4.1.min.js'])
    .pipe(gulp.dest("www/js/lib/bower/createjs-preloadjs/lib/"));

  gulp.src(['source/js/lib/bower/jquery/dist/jquery.min.js'])
    .pipe(gulp.dest("www/js/lib/bower/jquery/dist/"));

});

/* Scripts task for concatinating javascript */
gulp.task('scripts', ['bootstrapped-scripts', 'clean'], function(){

  // add relative url to scripts
  for(var i = 0; i < APP.Assets.scripts.length; i++){
    APP.Assets.scripts[i] = "source/" + APP.Assets.scripts[i];
  }

  return gulp.src(APP.Assets.scripts)
    .pipe(concat("all.min." + currDate + ".js"))
    .pipe(uglify({compress: false}))
    .pipe(gulp.dest("www/js/"));

});

/* Templates task to inline templates into index.html file and output at build.html */
gulp.task('templates', ['clean'], function(){

  var templates = '', index = '', delimiter = '<div id="templates">';

  var loadTemplates = function(callback){

    // Loop throuhg each template and load
    for(var i = 0; i < APP.Assets.templates.length; i++){

      APP.Assets.templates[i] = "source/" + APP.Assets.templates[i];

      fs.readFile(APP.Assets.templates[i], {encoding: 'utf8'}, function (err, data) {
        if (err) throw err;
        templates += data;
      });

      // If last iteration and callback, run callback
      if(i == APP.Assets.templates.length-1){
        if(callback) callback();
      }

    }

  };

  var editIndexHtml = function(){

    fs.readFile("source/index.html", {encoding: 'utf8'}, function (err, data) {

      if (err) throw err;

      // Inline the templates in the 'index.html' file
      index = data.substr(0, data.indexOf(delimiter) + delimiter.length);
      index += "\n" + templates + "\n";
      index += data.substr(data.indexOf(delimiter) + delimiter.length);

      // Remove enviroment veriable
      index = index.replace("development", "");

      // Rename main scripts url
      var scriptName = "all.min." + currDate + ".js";
      index = index.replace("all.min.js", scriptName);

      // Rename main styles url
      var styleName = "all." + currDate + ".css";
      index = index.replace("all.css", styleName);

      fs.writeFile('www/index.html', index, function(err){
        if (err) throw err;
      });

    });

  };

  // Start by loading templates
  loadTemplates(editIndexHtml);

});

/* sass task to compile sass files ('gulp sass') */
gulp.task('sass', ['clean'], function() {

  return gulp.src(['source/styles/sass/*.sass', '!source/styles/sass/_*.sass'])
  .pipe(sass({style: 'compressed', noCache: true}))
  .on('error', function(error){
    console.log(error.message);
  })
  .on('end', function(){})
  .pipe(rename(function (path) {
    // Renames output .sass file with timestamp (cache-bust)
    path.basename += "." + currDate;
  }))
  .pipe(gulp.dest('www/css'));

});

/* sass task to compile sass files ('gulp sass') */
gulp.task('clean', function() {

  return gulp.src(['www/*'], {read:false})
  .pipe(clean());

});

/* sass task to compile sass files ('gulp sass') */
gulp.task('styles', ['sass', 'css']);

/* Build task */
gulp.task('build', ['clean', 'rootfiles', 'fonts', 'data', 'images', 'styles', 'templates', 'scripts'], function(){

  // console.log("Build complete");

});

/*****************************/
/*****************************/

/*   DEVELOPMENT GULP TASKS  */

/*****************************/
/*****************************/

/* sass task to compile sass files ('gulp sass') */
gulp.task('styles-dev', ['sass-dev', 'css-dev']);

/* sass task to compile sass files ('gulp sass') */
gulp.task('sass-dev', function() {

  return gulp.src(['source/styles/sass/**/*.sass', '!source/styles/sass/**/_*.sass'])
  .pipe(sass({style: 'expanded', noCache: true}))
  .on('error', function(error){
    console.log(error);
  })
  .on('end', function(){
    // console.log('Compiled sass');
  })
  .pipe(gulp.dest('source/css'))
  .pipe(livereload(server));

});

gulp.task('css-dev', function() {

  return gulp.src(['source/styles/lib/**/*'])
  .pipe(gulp.dest('source/css/lib'));

});

gulp.task('bower-install', function(callback){

  // bower.config.cwd += "/source";
  // console.log("bower.config", bower.config);

  // // console.log("bower.commands.list", bower.commands.list);

  // // bower.commands.list(function(){
  //   // console.log("hi");
  // // });

  // bower.commands.install([], {save: true}, {})
  // .on('end', function(installed){ callback() });

});

gulp.task('init', ['bower-install'], function(){

});

/* Default gulp task ('gulp') */
gulp.task('default', ['styles-dev'], function() {

  server.listen(35729, function(err){
    if(err) return console.log(err);
    console.log('Listening on port 35729 for file changes changes');

    gulp.watch('source/styles/**/*', ['styles-dev']);

    gulp.watch(['source/**/*.*', '!source/styles/**/*', '!source/css/**/*'])
    .on('change', function(file) {

      gulp.src([file.path], {read:false})
        .pipe(livereload(server));

    });

  });

});
