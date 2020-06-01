
const project_folder = 'dist';
const source_folder = 'src';

const path = {
  build: {
    html: project_folder+'/',
    css: project_folder+'/css/',
    js: project_folder+'/js/'
  },
  src: {
    html: source_folder+'/pug/index.pug',
    css: source_folder+'/scss/style.scss',
    js: source_folder+'/js/script.js'
  },
  watch: {
    html: source_folder+'/pug/**/*.pug',
    css: source_folder+'/scss/**/*.scss',
    js: source_folder+'/js/**/*js'
  },
  clean: "./" + project_folder +'/'
};

const { src, dest } = require('gulp'),
  gulp = require('gulp'),
  browsersync = require('browser-sync').create(),
  pug = require('gulp-pug'),
  del = require('del'),
  scss = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  clean_css = require('gulp-clean-css'),
  uglify = require('gulp-uglify-es').default,
  rename = require('gulp-rename'),
  babel = require('gulp-babel');

function browserSync() {
  browsersync.init({
    server: {
      baseDir: "./" + project_folder +'/'
    },
    port: 3000,
    notify: false
  })
}

const pugCompile = () => {
  return src(path.src.html)
    .pipe(pug({pretty: true}))
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
};

const scssCompile = () => {
  return src(path.src.css)
    .pipe(scss())
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 5 versions'],
      cascade: true
    }))
    .pipe(dest(path.build.css))
    .pipe(clean_css())
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
};

const jsCompile = () => {
  return src(path.src.js)
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
};

const watchFiles = () => {
  gulp.watch([path.watch.html], pugCompile);
  gulp.watch([path.watch.css], scssCompile);
  gulp.watch([path.watch.js], jsCompile);
};

const clean = () => {
  return del(path.clean);
};

const build = gulp.series(clean, gulp.parallel(pugCompile, scssCompile, jsCompile));
const watch = gulp.parallel(build, watchFiles, browserSync);

exports.jsCompile = jsCompile;
exports.pugCompile = pugCompile;
exports.scssCompile = scssCompile;
exports.build = build;
exports.watch = watch;
exports.default = watch;