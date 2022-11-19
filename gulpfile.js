const { src, dest, watch, series, parallel } = require('gulp');

// CSS y SASS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

// Imágenes
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

function css( done ) {
    // compilar sass
    //pasos: 1 - Identificar archivo, 2 - Compilarla, 3 - Guardar el .css

    src('src/scss/app.scss') /* 1 */
        .pipe(sourcemaps.init() ) /*sourcemaps*/
        .pipe( sass() ) /* 2 */
        .pipe( postcss( [ autoprefixer(), cssnano() ] ) )
        .pipe( sourcemaps.write('.')) /*sourcemaps*/
        .pipe( dest('build/css') ) /* 3 */

    done();
} 

function imagenes(done) {
    src('src/img/**/*')
        .pipe( imagemin({ optimizationLevel: 3 }) )
        .pipe( dest('build/img') );


    done();
}

function convertwebp() {
    return src('src/img/**/*.{png,jpg}')
        .pipe( webp() )
        .pipe( dest('build/img') )
}

function convertavif() {
    const opciones = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')
        .pipe( avif( opciones ) )
        .pipe( dest('build/img') )
}

function dev() {
    watch('src/scss/**/*.scss', css); /* que va a estar "viendo", que ejecuta/hace cuando hay cambios */
    watch('src/img/**/*', imagenes);
}

exports.dev = dev;
exports.css = css;
exports.default = series(imagenes, convertwebp, convertavif, css, dev);

// Series: Se inicia una tarea y hasta que finaliza inicia la siguiente
// Parallel - Todas inician al mismo tiempo