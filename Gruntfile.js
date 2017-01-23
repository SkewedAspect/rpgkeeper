//----------------------------------------------------------------------------------------------------------------------
// RPGKeeper Gruntfile.
//----------------------------------------------------------------------------------------------------------------------

module.exports = function(grunt)
{
    grunt.initConfig({
        clean: ['dist'],
        copy: {
            index: {
                src: 'client/index.html',
                dest: 'dist/index.html'
            },
            manifest: {
                src: 'client/manifest.json',
                dest: 'dist/manifest.json'
            },
            static: {
                expand: true,
                cwd: 'client',
                src: 'static/**/*',
                dest: 'dist'
            },
            html: {
                expand: true,
                cwd: 'client',
                src: '**/*.html',
                dest: 'dist'
            },
            materialize: {
                expand: true,
                cwd: 'node_modules/vue-material/dist',
                src: '*.css*',
                dest: 'dist/vendor/vue-material'
            },
            vendor: {
                expand: true,
                cwd: 'node_modules',
                src: ['spinkit/**/*.css'],
                dest: 'dist/vendor'
            }
        },
        browserify: {
            options: {
                browserifyOptions: {
                    debug: true
                },
                transform: [
                    ["vueify"],
                    ["babelify"]
                ]
            },
            debug: {
                options: {
                    watch: true,
                    watchOptions: {
                        ignoreWatch: true
                    },
                    browserifyOptions: {
                        debug: true
                    }
                },
                files: {
                    "./dist/app.js": "client/app.js"
                }
            }
        },
        sass: {
            dist: {
                options: {
                    includePaths: ['client/scss', 'client'],
                    style: 'expanded'
                },
                files: {
                    'dist/css/app.css': 'client/scss/theme.scss'
                }
            }
        },
        postcss: {
            options: {
                processors: [ require('autoprefixer')({browsers: 'last 2 versions'}) ]
            },
            dist: {
                src: 'dist/css/*.css'
            }
        },
        watch: {
            index: {
                files: ["client/index.html"],
                tasks: ["copy:index"]
            },
            html: {
                files: ["client/**/*.html"],
                tasks: ["copy:html"]
            },
            scss: {
                files: ["client/scss/**/*.scss"],
                tasks: ["sass", "postcss"]
            }
        }
    });

    //------------------------------------------------------------------------------------------------------------------

    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');

    //------------------------------------------------------------------------------------------------------------------

    grunt.registerTask("build", ["clean", "sass", "postcss", "copy", "browserify"]);
    grunt.registerTask("default", ["build", 'watch']);

    //------------------------------------------------------------------------------------------------------------------
};

//----------------------------------------------------------------------------------------------------------------------
