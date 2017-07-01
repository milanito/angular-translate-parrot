import gulp from 'gulp';
import esdoc from 'gulp-esdoc';
import eslint from 'gulp-eslint';

gulp.task('doc', () => gulp.src('./src')
.pipe(esdoc({ destination: './docs'  })));


gulp.task('lint', () => gulp.src(['./src/**/*.js',
  '!dist/**', '!node_modules/**', '!coverage/**'])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError()));
