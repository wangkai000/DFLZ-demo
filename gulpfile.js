var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', ['sass'], function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

//合并controllers下的文件
gulp.task('concat-controllers',function(){
  gulp.src(["www/js/controllers/base.js","www/js/controllers/*.js"])
  .pipe(concat("controllers.js"))
  .pipe(gulp.dest("www/js"))
});

//合并services下的文件
gulp.task('concat-services',function(){
  gulp.src(["www/js/services/base.js","www/js/services/*.js"])
  .pipe(concat("services.js"))
  .pipe(gulp.dest("www/js"))
});

//观察文件变化并且做出操作
gulp.task('watchJs',['concat-controllers','concat-services'],function(){

	console.log('------------------合并成功---------------')
	gulp.watch(['www/js/controllers/*','www/js/services/*'],['concat-controllers','concat-services']).on('change',function(event){
		console.log(event.path+'--------------改变')
	});
})

