module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        //Read the package.json (optional)
        pkg: grunt.file.readJSON('package.json'),

        // Metadata.
        meta: {
            basePath: './',
            srcJsPath: './src/js/',
            srcSassPath: './src/css/',
            srcImgPath: './src/images/',
            distPath: './src/dist/'
        },

        uglify: {
            compressjs: {
                files: {
                    '<%= meta.distPath %>h5_preheating.min.js': [ '<%= meta.srcJsPath %>plugin/jquery-2.1.3.min.js', '<%= meta.srcJsPath %>plugin/my_jquery.fullPage.js', '<%= meta.srcJsPath %>plugin/jquery.flipster.js', '<%= meta.srcJsPath %>load.js', '<%= meta.srcJsPath %>global.js', '<%= meta.srcJsPath %>wx-share.js', '<%= meta.srcJsPath %>h5_preheating.js']
                }
            }
        },

        // sass
        sass: {
            dist: {
                options: {
                    style: 'compressed',
                    sourcemap: 'none'
                },
                files: [
                    {'<%= meta.distPath %>h5_preheating.css': '<%= meta.srcSassPath %>h5_preheating.scss'}
                ]
            }
        },

        // 自动雪碧图
        sprite: {
            options: {
                // sprite背景图源文件夹，只有匹配此路径才会处理，默认 images/slice/
                imagepath: '<%= meta.srcImgPath %>icon/',
                // 映射CSS中背景路径，支持函数和数组，默认为 null
                imagepath_map: null,
                // 雪碧图输出目录，注意，会覆盖之前文件！默认 images/
                spritedest: '<%= meta.distPath %>/images/',
                // 替换后的背景路径，默认 ../images/
                spritepath: '../images/',
                // 各图片间间距，如果设置为奇数，会强制+1以保证生成的2x图片为偶数宽高，默认 0
                padding: 0,
                // 是否使用 image-set 作为2x图片实现，默认不使用
                useimageset: false,
                // 是否以时间戳为文件名生成新的雪碧图文件，如果启用请注意清理之前生成的文件，默认不生成新文件
                newsprite: false,
                // 给雪碧图追加时间戳，默认不追加
                spritestamp: false,
                // 在CSS文件末尾追加时间戳，默认不追加
                cssstamp: true,
                // 默认使用二叉树最优排列算法
                algorithm: 'binary-tree',
                // 默认使用`pixelsmith`图像处理引擎
                engine: 'pixelsmith'
            },
            autoSprite: {
                files: [{
                    // 启用动态扩展
                    expand: true,
                    // css文件源的文件夹
                    cwd: '<%= meta.distPath %>',
                    // 匹配规则
                    src: '*.css',
                    // 导出css和sprite的路径地址
                    dest: '<%= meta.distPath %>css/',
                    // 导出的css名
                    ext: '.sprite.css'
                }]
            }
        }

        ,watch: {
            build: {
                files: [
                    '<%= meta.srcJsPath %>*.js','<%= meta.srcSassPath %>*.scss','<%= meta.srcImgPath %>slice/*'
                ],
                tasks: ['uglify', 'sass', 'sprite']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-css-sprite');


    // 默认被执行的任务列表。
    grunt.registerTask('default', ['uglify', 'sass', 'sprite', 'watch']);

};