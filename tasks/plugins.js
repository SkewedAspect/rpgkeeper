//----------------------------------------------------------------------------------------------------------------------
// A Grunt task to discover plugins and add required javascript files into the index.html
//
// @module plugins.js
//----------------------------------------------------------------------------------------------------------------------

var fs = require('fs');
var path = require('path');

var _ = require('lodash');
var discoverable = require('discoverable');

//----------------------------------------------------------------------------------------------------------------------

module.exports = function(grunt)
{
    grunt.registerMultiTask('plugins',
        "Discovers plugins and then adds their client-side javascript to the specified template.",
        function()
        {
            var done = this.async();

            // Build configuration
            var config = _.defaults(this.data, {
                src: 'index.tpl.html',
                dest: 'index.html',
                modules: 'plugins',
                urlPrefix: '/plugins/'
            });

            var catalog = new discoverable.Catalog(path.dirname(path.resolve(__dirname)));
            catalog.getModules(config.modules)
                .then(function(modules)
                {
                    var scripts = [];
                    _.each(modules, function(module)
                    {
                        // Handle symlinks, and get the directory of the module
                        var modPath = fs.realpathSync(path.resolve(path.dirname(module.filename)));

                        // Now that we have that directory, we require the module
                        module = require(module.filename);

                        // Get a list of scripts that need to be included
                        var scriptPaths = grunt.file.expand(path.join(modPath, module.scripts));

                        // Rewrite the files paths into a url
                        scripts = scripts.concat(_.reduce(scriptPaths, function(results, scriptPath)
                        {
                            // We make the assumption that the plugin has an 'id' property, and that it's static files
                            // are mounted at '<ulrPrefix>/<module.id>/'
                            results.push(config.urlPrefix + '/' + module.id + '/' + path.relative(module.staticRoot, scriptPath));
                            return results;
                        }, []));
                    });

                    var input = grunt.file.read(config.src);
                    grunt.file.write(config.dest, grunt.template.process(input, { data: { scripts: scripts } }));
                });
        });
}; // end module.exports

//----------------------------------------------------------------------------------------------------------------------