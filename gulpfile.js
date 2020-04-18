const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();

const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const less = require('gulp-less');
const stylus = require('gulp-stylus');

const imagemin = require('gulp-imagemin');
const htmlclean = require('gulp-htmlclean');
const rigger = require('gulp-rigger');

// scss & sass
const sassFiles = [
  './src/scss/global.scss',
  './src/scss/common/main.scss',
  './src/scss/common/**/*.scss',
  './src/scss/media/**/*.scss',
]

const jsFiles = [
  './src/js/*.js',
]

// sass & scss
const styles = () => (
  gulp.src(sassFiles)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(concat('styles.css'))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.stream())
)

// // less
// const styles = () => (
//   gulp.src(lessFiles)
//     .pipe(sourcemaps.init())
//     .pipe(less())
//     .pipe(concat('styles.css'))
//     .pipe(autoprefixer({ cascade: false }))
//     .pipe(cleanCSS({ level: 2 }))
//     .pipe(sourcemaps.write('./'))
//     .pipe(gulp.dest('build/css'))
//     .pipe(browserSync.stream())
// )

const scripts = () => (
  gulp.src(jsFiles)
    .pipe(concat('script.js'))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify({
      toplevel: true
    }))
    .pipe(gulp.dest('build/js'))
    .pipe(browserSync.stream())
)

const clean = () => (
  del(['build/*'])
)

const minimazeImage = () => (
  gulp.src('./src/img/**')
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest('./build/img'))
);

const html = () => (
  gulp.src('./src/html/*.html')
    .pipe(rigger())
    .pipe(htmlclean())
    .pipe(gulp.dest('./build'))
);

const fonts = () => (
  gulp.src('./src/fonts/*{ttf,woff,woff2,svg,eot}')
    .pipe(gulp.dest('./build/fonts'))
);

const htmlPreBuild = () => (
  gulp.src('./src/html/*.html')
    .pipe(rigger())
    .pipe(gulp.dest('./build'))
);

const stylesPreBuild = () => (
  gulp.src(sassFiles)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.stream())
)

const scriptsPreBuid = () => (
  gulp.src(jsFiles)
    .pipe(concat('script.js'))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest('build/js'))
)

const watch = () => {
  browserSync.init({
    server: {
      baseDir: "./build/"
    }
  });

  //html - especially written in this way for the sake of practise
  gulp.watch('./src/html/**/*.html').on('change', gulp.series(html, browserSync.reload));

  // scss & sass
  gulp.watch('./src/scss/**/*.scss', styles);

  // less
  // gulp.watch('./src/less/**/*.less', styles);

  //script
  gulp.watch('./src/js/**/*.js', scripts);

  // img
  gulp.watch('./src/img/**', minimazeImage);

  // fonts
  gulp.watch('./src/fonts', fonts);

}

gulp.task('pre', gulp.parallel(htmlPreBuild, stylesPreBuild, scriptsPreBuid));
gulp.task('build-pre', gulp.series(clean, gulp.parallel(stylesPreBuild, scriptsPreBuid, minimazeImage, htmlPreBuild, fonts)));
gulp.task('run-pre', gulp.series('build-pre', watch));


gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts, minimazeImage, html, fonts)));
gulp.task('default', gulp.series('build', watch));

