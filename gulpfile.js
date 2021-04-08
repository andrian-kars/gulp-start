const { src, dest, watch, parallel } = require('gulp')

const scss = require('gulp-sass')
const concat = require('gulp-concat')
const browserSync = require('browser-sync').create()
const uglify = require('gulp-uglify-es').default

const browsersync = () => {
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    })
}

const scripts = () => {
    return src([
        // '', // adding plugins ex: 'node_modules/jquery/dist/jquery.js'
        'app/js/main.js',
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}

const styles = () => {
    return src('app/scss/style.scss')
        .pipe(scss({ outputStyle: 'compressed' })) // 'expanded' for well looking css (remove min)
        .pipe(concat('style.min.css'))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

const watching = () => {
    watch(['app/scss/**/*.scss'], styles)
    watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts)
    watch(['app/*.html']).on('change', browserSync.reload)
}

exports.styles = styles
exports.watching = watching
exports.browsersync = browsersync
exports.scripts = scripts

exports.default = parallel(browsersync, watching)