// Импорт пакетов
const gulp          = require('gulp')
const less          = require('gulp-less')
const stylus        = require('gulp-stylus')
const sass          = require('gulp-sass')(require('sass'))
const rename        = require('gulp-rename')
const cleanCSS      = require('gulp-clean-css')
const ts            = require('gulp-typescript')
//const coffee      = require('gulp-coffee')
const babel         = require('gulp-babel')
const uglify        = require('gulp-uglify')
const concat        = require('gulp-concat')
const sourcemaps    = require('gulp-sourcemaps')
const autoprefixer  = require('gulp-autoprefixer')
const imagemin      = require('gulp-imagemin')
const htmlmin       = require('gulp-htmlmin')
const size          = require('gulp-size')
//const gulppug     = require('gulp-pug')
const newer         = require('gulp-newer')
const browsersync   = require('browser-sync').create()
const del           = require('del')
const GulpClient    = require('gulp')


// Пути исходных файлов src и пути к результирующим файлам dest
const paths = {
    html: {
        src: [
            'src/*.html', 
            'src/*.pug'
        ],
        dest: 'dist/'
    },
    styles: {
        src: [
            'src/styles/**/*.sass',
            'src/styles/**/*.scss',
            'src/styles/**/*.styl',
            'src/styles/**/*.less',
            'src/styles/**/*.css'
        ],
        dest: 'dist/css/'
    },
    scripts: {
        src: [
            'src/scripts/**/*.coffee',
            'src/scripts/**/*.ts',
            'src/scripts/**/*.js'
        ],
        dest: 'dist/js/'
    },
    images: {
        src: 'src/img/**',
        dest: 'dist/img/'
    },
    fonts: {
        src: 'src/fonts/**',
        dest: 'dist/fonts/'
    },
    icons: {
        src: 'src/icons/**',
        dest: 'dist/icons/'
    },
    video: {
        src: 'src/video/**',
        dest: 'dist/video/'
    }
}


// Очистить каталог dist, удалить все кроме изображений
function clean() {
    return del([
        'dist/*.*',     // Полностью удалить содержимое 
        '!dist/img',    // Не удалять файлы в img
        '!dist/video'   // Не удалять файлы в Video
    ])
}


// Обработка html и pug
function html() {
    return gulp.src(paths.html.src)         // Исходная папка
        //.pipe(gulppug())                  // Pug препроцессор HTML кода
        .pipe(htmlmin({ collapseWhitespace: true }))   // Минификация HTML файлов
        .pipe(size({                        // Отобразить размер файлов в консоли
            showFiles: true
        }))
        .pipe(gulp.dest(paths.html.dest))   // Папка назначения
        .pipe(browsersync.stream())         // Обновлять страницу браузера при изменениях
}

// Обработка препроцессоров стилей
function styles() {
    return gulp.src(paths.styles.src)   // Исходная папка
        .pipe(sourcemaps.init())        // Карта строк кода для инструментов
        //.pipe(less())                 // Преобразование из Less в CSS
        //.pipe(stylus())               // Преобразование из Stylus в CSS
        .pipe(sass().on('error', sass.logError))   // Компиляция Sass/SCSS файлов в CSS
        .pipe(autoprefixer({            // Добавление вендорных префиксов 
            cascade: false
        }))
        .pipe(cleanCSS({                // Минификация и оптимизация CSS файлов
            level: 2
        }))
        .pipe(rename({                  // Переименование файлов
            basename: 'style',
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))    // Запись внешних исходных файлов карт
        .pipe(size({                    // Отобразить размер файлов в консоли
            showFiles: true
        }))
        .pipe(gulp.dest(paths.styles.dest))   // Папка назначения
        .pipe(browsersync.stream())     // Обновлять страницу браузера при изменениях
}

// Обработка Java Script, Type Script и Coffee Script
function scripts() {
    return gulp.src(paths.scripts.src)  // Исходная папка
        .pipe(sourcemaps.init())        // Карта строк кода для инструментов
        //.pipe(coffee({bare: true}))   // Преобразование СoffeeScript в стандартный JS
        /*
        .pipe(ts({                      // Преобразование TypeScript в стандартный JS
          noImplicitAny: true,
          outFile: 'main.min.js'
        }))
        */
        .pipe(babel({                   // Преобразует JS в старый стандарт  
            presets: ['@babel/env']
        }))
        .pipe(uglify())                 // Сжатие и оптимизация JS кода  
        .pipe(concat('main.min.js'))    // Объединение нескольких файлов JS в один 
        .pipe(sourcemaps.write('.'))    // Запись внешних исходных файлов карт
        .pipe(size({                    // Выводит размер файлов в консоли 
            showFiles: true
        }))
        .pipe(gulp.dest(paths.scripts.dest))    // Папка назначения
        .pipe(browsersync.stream())     // Обновлять страницу браузера при изменениях
}

// Сжатие изображений
function img() {
    return gulp.src(paths.images.src)       // Исходная папка
        .pipe(newer(paths.images.dest))     // Отслеживание только новых файлов
        .pipe(imagemin({                    // Сжатие изображений
            progressive: true
        }))
        .pipe(size({                        // Отображение размеров файлов в терминале
            showFiles: true
        }))
        .pipe(gulp.dest(paths.images.dest)) // Папка назначения
}


// Копирование SVG (без модификаций)
function svg() {
    return gulp.src(paths.icons.src)        // Исходная папка
        .pipe(newer(paths.icons.dest))      // Отслеживание только новых файлов
        .pipe(size({                        // Отображение размеров файлов в терминале
            showFiles: true
        }))
        .pipe(gulp.dest(paths.icons.dest))  // Папка назначения
}

// Копирование Video (без модификаций)
function video() {
    return gulp.src(paths.video.src)        // Исходная папка
        .pipe(newer(paths.video.dest))      // Отслеживание только новых файлов
        .pipe(size({                        // Отображение размеров файлов в терминале
            showFiles: true
        }))
        .pipe(gulp.dest(paths.video.dest))  // Папка назначения
}

// Копирование Fonts (без модификаций)
function fonts() {
    return gulp.src(paths.fonts.src)        // Исходная папка
        .pipe(newer(paths.fonts.dest))      // Отслеживание только новых файлов
        .pipe(size({                        // Отображение размеров файлов в терминале
            showFiles: true
        }))
        .pipe(gulp.dest(paths.fonts.dest))  // Папка назначения
}


// Отслеживание изменений в файлах и запуск лайв сервера
function watch() {
    browsersync.init({
        server: {
            baseDir: "./dist"
        }
    })
    gulp.watch(paths.html.dest).on('change', browsersync.reload)
    gulp.watch(paths.html.src, html)
    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.scripts.src, scripts)
    gulp.watch(paths.images.src, img)
    gulp.watch(paths.icons.src, svg)
    gulp.watch(paths.video.src, video)
    gulp.watch(paths.fonts.src, fonts)
}

// Таски для ручного запуска с помощью gulp clean, gulp html и т.д.
exports.clean = clean
exports.html = html
exports.styles = styles
exports.scripts = scripts
exports.img = img
exports.watch = watch

// Таск, который выполняется по команде gulp
exports.default = gulp.series(clean, html, gulp.parallel(styles, scripts, img, fonts, svg, video), watch)