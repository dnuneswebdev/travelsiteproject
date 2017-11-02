var gulp = require("gulp");
var svgSprite = require("gulp-svg-sprite");
var rename = require("gulp-rename");
var del = require("del");
var svgT2Png = require("gulp-svg2png");



var config = {
    shape: {
        spacing: {
            padding: 1
        }
    },
    mode: {
        css: {
            variables: {
                replaceSvgWithPng: function() {
                    return function(sprite, render) {
                        return render(sprite).split(".svg").join(".png");

                        
                    }
                }
            },
            sprite: "sprite.svg",
            render: {
                css: {
                    template: "./gulp/templates/sprite.css"
                }
            }
        }
    }
}

gulp.task("beginClean", function() {
    return del(["./app/temp/sprite", "./app/assets/images/sprites"]);
});

gulp.task("createSprite", ["beginClean"], function () {
    return gulp.src("./app/assets/images/icons/**/*.svg")
    .pipe(svgSprite(config))
    .pipe(gulp.dest("./app/temp/sprite/"));
});

gulp.task("createPngCopy", ["createSprite"], function() {
    return gulp.src("./app/temp/sprite/css/*.svg")
    .pipe(svgT2Png())
    .pipe(gulp.dest("./app/temp/sprite/css"));
});

gulp.task("copySpriteGraphic", ["createPngCopy"], function() {
    gulp.src("./app/temp/sprite/css/*.{svg, png}")
    .pipe(gulp.dest("./app/assets/images/sprites"));
});

gulp.task("copySpritecss", ["createSprite"], function() {
    return gulp.src("./app/temp/sprite/css/*.css")
    .pipe(rename("_sprite.css"))
    .pipe(gulp.dest("./app/assets/styles/modules"));
});

gulp.task("endClean", ["copySpriteGraphic", "copySpritecss"], function() {
    return del("./app/temp/sprite");
});

gulp.task("icons", ["beginClean", "createSprite", "createPngCopy", 
"copySpriteGraphic", "copySpritecss", "endClean"]);