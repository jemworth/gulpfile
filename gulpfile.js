var gulp = require('gulp'),
		browserSync = require('browser-sync').create(),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    cssnano = require('gulp-cssnano'),
    imagemin = require('gulp-imagemin'),
    sass = require('gulp-sass'),
    cache = require('gulp-cache'),
    del = require('del'),
    runSequence = require('run-sequence');

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
});
gulp.task('sass', function () {
  return gulp.src('app/scss/**/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.reload({
    stream: true
  }))
});
gulp.task('useref', function(){
  return gulp.src('app/*.html')
  .pipe(useref())
  .pipe(gulpIf('*.css', cssnano()))
  .pipe(gulpIf('*.js', uglify()))
  .pipe(gulp.dest('dist'))
})
gulp.task('images', function(){
  return gulp.src('app/img/**/*.+(png|jpg|jpeg|gif|svg)')
  .pipe(cache(imagemin({
    interlaced: true
  })))
  .pipe(gulp.dest('dist/img'))
});
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
});
gulp.task('clean', function() {
  return del.sync('dist').then(function(cb) {
    return cache.clearAll(cb);
  });
})
gulp.task('clean:dist', function() {
  return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});
gulp.task('watch', ['browserSync','sass'], function(){
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload); 
  gulp.watch('app/js/**/*.js', browserSync.reload);
});
gulp.task('default', function (callback) {
  runSequence(['sass','browserSync'], 'watch',
    callback
  )
});
gulp.task('build', function (callback) {
  runSequence(
    'clean:dist', 'sass', ['useref', 'images', 'fonts'],
    callback
  )
});