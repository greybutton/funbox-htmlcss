import gulp from 'gulp';
import del from 'del';
import plugins from 'gulp-load-plugins';
import browser from 'browser-sync';

const $ = plugins();

function pug() {
  return gulp.src('./src/*.pug')
    .pipe($.pug({
      pretty: true
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(browser.reload({
      stream: true
    }));
}

function sass() {
  return gulp.src('./src/styles/index.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass()
      .on('error', $.sass.logError))
    .pipe($.autoprefixer())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/styles'))
    .pipe(browser.reload({
      stream: true
    }));
}

function images() {
  return gulp.src('./src/images/**/*')
    .pipe(gulp.dest('./dist/images'))
}

function server(done) {
  browser.init({
    server: './dist'
  });
  done();
}

function watch() {
  gulp.watch('./src/**/*.pug').on('all', gulp.series(pug));
  gulp.watch('./src/**/*.scss').on('all', gulp.series(sass));
}

function html() {
  return gulp.src('./src/index.pug')
    .pipe($.pug())
    .pipe($.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist'))
}

function styles() {
  return gulp.src('./src/styles/index.scss')
    .pipe($.sass()
      .on('error', $.sass.logError))
    .pipe($.autoprefixer())
    .pipe($.cssnano())
    .pipe(gulp.dest('./dist/styles'))
}

function imagemin() {
  return gulp.src('./src/images/**/*')
    .pipe($.imagemin())
    .pipe(gulp.dest('./dist/images'))
}

function clean(cb) {
  del(['./dist']);
  cb();
}

gulp.task('default',
  gulp.series(clean, sass, pug, images, server, watch));

gulp.task('build',
  gulp.series(clean, imagemin, styles, html));
