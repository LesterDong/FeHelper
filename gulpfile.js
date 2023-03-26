/**
 * Chrome Extension Builder By Gulp
 */

let gulp = require('gulp');

let clean = require('gulp-clean');
let copy = require('gulp-copy');
let zip = require('gulp-zip');
let uglifyjs = require('gulp-uglify-es').default;
let uglifycss = require('gulp-uglifycss');
let htmlmin = require('gulp-htmlmin');
let jsonmin = require('gulp-jsonminify');
let fs = require('fs');
let through = require('through2');
let path = require('path');
let pretty = require('pretty-bytes');
let shell = require('shelljs');
let runSequence = require('run-sequence');

gulp.task('clean', () => {
    return gulp.src('output', {read: false}).pipe(clean({force: true}));
});

gulp.task('copy', () => {
    return gulp.src(['apps/**/*.{gif,png,jpg,jpeg,cur,ico}', '!apps/static/screenshot/**/*']).pipe(copy('output'));
});

gulp.task('json', () => {
    return gulp.src('apps/**/*.json').pipe(jsonmin()).pipe(gulp.dest('output/apps'));
});

gulp.task('html', () => {
    return gulp.src('apps/**/*.html').pipe(htmlmin({collapseWhitespace: true})).pipe(gulp.dest('output/apps'));
});

// 合并 & 压缩 js
gulp.task('js', () => {
    let jsMerge = () => {
        return through.obj(function (file, enc, cb) {
            let contents = file.contents.toString('utf-8');

            let merge = (fp, fc) => {

                // 合并 __importScript
                return fc.replace(/__importScript\(\s*(['"])([^'"]*)\1\s*\)/gm, function (frag, $1, mod) {
                    let mp = path.resolve(fp, '../' + mod + (/\.js$/.test(mod) ? '' : '.js'));
                    let mc = fs.readFileSync(mp).toString('utf-8');
                    return merge(mp, mc + ';');
                });
            };

            contents = merge(file.path, contents);
            file.contents = new Buffer.from(contents);
            this.push(file);
            return cb();
        })
    };

    return gulp.src('apps/**/*.js').pipe(jsMerge()).pipe(uglifyjs()).pipe(gulp.dest('output/apps'));
});

// 合并 & 压缩 css
gulp.task('css', () => {

    let cssMerge = () => {
        return through.obj(function (file, enc, cb) {
            let contents = file.contents.toString('utf-8');

            let merge = (fp, fc) => {
                return fc.replace(/\@import\s+(url\()?\s*(['"])(.*)\2\s*(\))?\s*;?/gm, function (frag, $1, $2, mod) {
                    let mp = path.resolve(fp, '../' + mod + (/\.css$/.test(mod) ? '' : '.css'));
                    let mc = fs.readFileSync(mp).toString('utf-8');
                    return merge(mp, mc);
                });
            };

            contents = merge(file.path, contents);
            file.contents = new Buffer.from(contents);
            this.push(file);
            return cb();
        })
    };

    return gulp.src('apps/**/*.css').pipe(cssMerge()).pipe(uglifycss()).pipe(gulp.dest('output/apps'));
});

// 清理冗余文件，并且打包成zip，发布到chrome webstore
gulp.task('zip', () => {

    // 读取manifest文件
    let pathOfMF = './output/apps/manifest.json';
    let manifest = require(pathOfMF);

    manifest.name = manifest.name.replace('-Dev', '');
    fs.writeFileSync(pathOfMF, JSON.stringify(manifest));

    // ============压缩打包================================================
    shell.exec('cd output/ && rm -rf pgc-tools.zip && zip -r pgc-tools.zip apps/ > /dev/null && cd ../');
    let size = fs.statSync('output/pgc-tools.zip').size;
    size = pretty(size);


    console.log('\n\n================================================================================');
    console.log('    当前版本：', manifest.version, '\t文件大小:', size);
});

// builder
gulp.task('default', ['clean'], () => {
    // runSequence(['copy', 'css', 'js', 'html', 'json']);
    runSequence(['copy', 'css', 'js', 'html', 'json'], 'zip');
});

gulp.task('sync', () => {
    gulp.src('apps/**/*').pipe(gulp.dest('output/apps'));
});

gulp.task('watch', function() {
    gulp.watch('apps/**/*.js', ['default']);
});
