// Плагины
const gulp = require('gulp')
const less = require('gulp-less')
// Плагин для переименования файлов в директории сборки
const rename = require('gulp-rename')
// Плагин минификации CSS
const cleanCSS = require('gulp-clean-css')
// Плагин для перевода нового стандарта JS в старый для поддержки старых браузеров
const babel = require('gulp-babel')
// Плагин минификации JS
const uglify = require('gulp-uglify')
// Плагин объединения нескольких JS файлов в один
const concat = require('gulp-concat')
// Плагин для отображения правильного источника стилей и скриптов в devTools
const sourcemaps = require('gulp-sourcemaps')
// Плагин для добавления префиксов стилям
const autoprefixer = require('gulp-autoprefixer')
// Плагин удаления директорий
const del = require('del')

// Костанты путей
const paths = {
    styles: {
        src: 'src/styles/**/*.less',
        dest: 'dist/css/'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'dist/js/'
    }
}

// Функция очистки каталога сборки
function clean() {
    return del(['dist'])
}

// Функция сборки стилей
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.styles.dest))
}

// Функция сборки скриптов
function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.scripts.dest))


}

// Функция отслеживания изменений
function watch() {
    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.scripts.src, scripts)
}

// Функция сборки, состоящая из последовательного выполнения отдельных функций
// стили и скрипты выполняются параллельно
const build = gulp.series(clean, gulp.parallel(styles, scripts), watch)

exports.clean = clean
exports.styles = styles
exports.scripts = scripts
exports.watch = watch
exports.build = build
exports.default = build
