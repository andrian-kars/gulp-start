const { src, dest, watch, parallel, series } = require('gulp')

const scss = require('gulp-sass')
const concat = require('gulp-concat')
const browserSync = require('browser-sync').create()
const uglify = require('gulp-uglify-es').default
const autoprefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')
const del = require('del')

const browsersync = () => {
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    })
}

const images = () => {
    return src('app/images/**/*')
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.mozjpeg({ quality: 75, progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ]))
        .pipe(dest('dist/images'))
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
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 version'],
            grid: true
        }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

const cleanDist = () => {
    return del('dist')
}

const build = () => {
    return src([
        'app/css/style.min.css',
        'app/fonts/**/*',
        'app/js/main.min.js',
        'app/*.html',
    ], { base: 'app' })
        .pipe(dest('dist'))
}

const watching = () => {
    watch(['app/scss/**/*.scss'], styles)
    watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts)
    watch(['app/*.html']).on('change', browserSync.reload)
}

exports.browsersync = browsersync
exports.images = images
exports.scripts = scripts
exports.styles = styles
exports.cleanDist = cleanDist
exports.watching = watching

exports.build = series(styles, scripts, cleanDist, images, build)
exports.default = parallel(browsersync, watching)