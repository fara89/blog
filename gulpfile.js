const { src, dest } = require('gulp');
const jshint = require('gulp-jshint');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const {parallel, series, watch} = require('gulp');
const browserSync = require('browser-sync').create();



function processHTML() {
    return src('*.html')
      .pipe(dest('dist'));
  };


function processJS() {
    return src('scripts.js')
      .pipe(jshint({
        esversion: 8
      }))
      .pipe(jshint.reporter('default'))
      .pipe(babel({
        "presets": ["@babel/preset-env"]
      }))  
      .pipe(uglify())
      .pipe(dest('dist'));
  };

  function babelPolyfill() {
    return src('node_modules/babel-polyfill/browser.js')
      .pipe(dest('dist/node_modules/babel-polyfill'));
  };


  function browserSyncc() {
    browserSync.init({
      server: './dist',
      port: 8080,
      ui: {
        port: 8081
      }
    });
  };


  

  exports.processHTML = processHTML;
  exports.processJS = processJS;
  exports.babelPolyfill = babelPolyfill;
  
    
  exports.default = series(parallel(processJS,processHTML,babelPolyfill), function() {
    browserSyncc();
    watch('*.js', processJS);
    watch('*.html', processHTML);
  
    watch('dist/*.js', browserSync.reload);
    watch('dist/*.html', browserSync.reload);

  });
  
  