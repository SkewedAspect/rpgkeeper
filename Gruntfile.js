//----------------------------------------------------------------------------------------------------------------------
// RPGKeeper Gruntfile.
//----------------------------------------------------------------------------------------------------------------------

module.exports = function(grunt)
{
    // Project configuration.
    grunt.initConfig({
        project: {
            less: ['client/less/**/*.less', 'client/components/**/*.less']
        },
        less: {
            min: {
                options: {
                    paths: ['node_modules/bootstrap/less'],
                    compress: true
                },
                files: {
                    'client/css/rpgkeeper.min.css': ['<%= project.less %>']
                }
            }
        },
        plugins: {
            index: {
                src: "client/index.tpl.html",
                dest: "client/index.html",
                modules: "rpgk-systems",
                urlPrefix: "/systems/"
            }
        },
        watch: {
            less: {
                files: ['<%= project.less %>'],
                tasks: ['less'],
                options: {
                    atBegin: true
                }
            },
            plugins: {
                files: ['client/index.tpl.html'],
                tasks: ['plugins'],
                options: {
                    atBegin: true
                }
            }
        }
    });

    // Grunt Tasks.
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadTasks('tasks');

    // Setup the build task.
    grunt.registerTask('build', ['less', 'plugins']);
}; // module.exports

// ---------------------------------------------------------------------------------------------------------------------