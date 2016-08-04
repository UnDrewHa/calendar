var gulp = require('gulp'),
  watch = require('gulp-watch'),
  prefixer = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  rigger = require('gulp-rigger'),
  browserSync = require("browser-sync"),
  jade = require('gulp-jade'),
  reload = browserSync.reload,
  cleancss = require('gulp-clean-css'),
  notify = require("gulp-notify");

var path = {
    build: {
        html: 'build/',
        js: 'build/_js/',
        css: 'build/_css/',
        img: 'build/_i/',
        fonts: 'build/_fonts/'
    },
    src: {
        html: 'src/*.jade',
        js: 'src/_js/main.js',
        style: 'src/_style/main.scss',
        img: 'src/_i/**/*.*',
        fonts: 'src/_fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.jade',
        js: 'src/_js/**/*.js',
        style: 'src/_style/**/*.scss',
        img: 'src/_i/**/*.*',
        fonts: 'src/_fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: false,
    host: 'localhost',
    port: 3000,
    logPrefix: "Building::"
};

gulp.task('html:build', function () {
    var YOUR_LOCALS = {};
    gulp.src(path.src.html)
      .pipe(rigger())
      .pipe(jade({locals: YOUR_LOCALS, pretty: true}))
      .on('error', notify.onError(function(err){
          return {
              title: 'Jade',
              message: err.message
          };
      }))
      .pipe(gulp.dest(path.build.html))
      .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
      .pipe(rigger())
      .pipe(gulp.dest(path.build.js))
      .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
      .pipe(rigger())
      .pipe(sass())
      .on('error', notify.onError(function(err){
          return {
              title: 'SCSS',
              message: err.message
          };
      }))
      .pipe(prefixer({
          browsers: ['last 2 versions', 'ie 6-8', '> 1%']
      }))
      .pipe(cleancss())
      .pipe(gulp.dest(path.build.css))
      .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
      .pipe(gulp.dest(path.build.fonts))
});

gulp.task('image:build', function() {
    gulp.src(path.src.img)
      .pipe(gulp.dest(path.build.img))
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('default', ['build', 'webserver', 'watch']);