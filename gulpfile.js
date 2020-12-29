let gulp = require('gulp');
let htmlmin = require('gulp-htmlmin');
let sass = require('gulp-sass');
let postcss = require('gulp-postcss');
let cleanCSS = require('gulp-clean-css');
let sourcemaps = require('gulp-sourcemaps');
let rigger = require('gulp-rigger');
let uglify = require('gulp-terser');
let browserSync = require('browser-sync').create();

gulp.task('build:html', () => {
  return gulp.src('src/*.html')
      .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true
      }))
      .pipe(gulp.dest('build'));
});

gulp.task('build:scss', () => {
  return gulp.src('src/scss/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(postcss())
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('build/css'));
});

gulp.task('build:images', async () => {
  return gulp.src('src/images/**/*', {
    allowEmpty: true
  })
      .pipe(gulp.dest('build/images'));
});

gulp.task('build:resources', async () => {
  return gulp.src('src/fonts/**/*', {
    dot: true,
    allowEmpty: true
  })
      .pipe(gulp.dest('build/fonts'))
});

gulp.task('build',
  gulp.parallel(
      'build:html',
      'build:scss',
      'build:images',
      'build:resources'
  ));

gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: './build'
    }
  });
});

gulp.task('watch', () => {
  gulp.watch('src/*.html', gulp.series('build:html'));
  gulp.watch('src/scss/**/*.scss', gulp.series('build:scss'));
  gulp.watch('src/images/**/*', gulp.series('build:images'));
  gulp.watch(['src/fonts/**/*', 'src/fonts/**/.*'], gulp.series('build:resources'));
  gulp.watch('build/**/*').on('change', browserSync.reload);
});

gulp.task('start', gulp.series(
    'build',
    gulp.parallel(
        'serve',
        'watch'
    )
));
