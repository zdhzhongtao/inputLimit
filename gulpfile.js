var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

gulp.task('script', function () {
    gulp.src('*.js') //该任务针对的文件
        .pipe(uglify({
            mangle: false
        }))
        .pipe(rename({suffix:'.min'}))     //重命名
        .pipe(gulp.dest('dist/js')); //生成地址
});
gulp.task('elseTask', function () {});
gulp.task('default', ['script', 'elseTask']);