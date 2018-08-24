/*eslint-env node */

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
var jasmine = require('gulp-jasmine-phantom');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify-es');
var babel = require('gulp-babel');


gulp.task('default', ['copy-html', 'copy-imgs', 'styles', 'lint'], function() {
  gulp.watch('sass/**/*.scss', ['styles'])
  gulp.watch('js/**/*.js', ['lint'])
  gulp.watch('/index.html', ['copy-html']);
  gulp.watch('img/*', ['copy-imgs']);
  gulp.watch('./dist/index.html').on('change', browserSync.reload);

  browserSync.init({
     server: "./dist"
  });
});

gulp.task('dist', [
  'copy-html',
  'copy-imgs',
  'styles',
  'lint',
  'scripts-dist'
]);

gulp.task('scripts', function() {
  gulp.src('js/**/*.js')
    .pipe(babel())
    .pipe(concat('all.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('scripts-dist', function() {
  gulp.src('js/**/*.js')
    .pipe(babel())
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('lint', function() {
    return src(['js/**/*.js'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});

gulp.task('copy-html', function() {
  gulp.src('./index.html')
    .pipe(gulp.dest('.dist'));
})

gulp.task('copy-imgs', function() {
  gulp.src('img/*')
    .pipe(gulp.dest('dist/img'));
})

gulp.task('styles', function() {
  gulp.src('sass/**/*.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});
