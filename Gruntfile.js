module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: ['src'],
      options: {
        globals: {
          console: true,
          module: true,
          angular: false
        }
      }
    },

    concat: {
      pitch: {
        options: {
            // Replace all 'use strict' statements in the code with a single one at the top
            banner: "'use strict';\n",
            process: function(src, filepath) {
                return '// Source: ' + filepath + '\n' +
                src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
            },
        },
        src: [
          'src/directives/fc-presentation.js',
          'src/*/*.js',
        ],
        dest: 'dist/js/fc-presentation.js',
      }
    },

    ngAnnotate: {
        options: {
            singleQuotes: true,
        },
        app: {
            files: {
                'dist/js/fc-presentation.js': ['dist/js/fc-presentation.js']
            },
        }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> Mark Cremer <mark@firstcoders.co.uk> */\n',
        mangle: false,
        sourceMap: true
      },
      tms: {
        files: {
          'dist/js/fc-presentation.min.js' : ['dist/js/fc-presentation.js']
        }
      }
    },

    // less: {
    //   production: {
    //     files: {
    //       "dist/css/fc-presentation.css": "src/less/fc-presentation.less"
    //     }
    //   }
    // },

    // cssmin: {
    //   options: {
    //     shorthandCompacting: false,
    //     roundingPrecision: -1
    //   },
    //   target: {
    //     files: {
    //       'dist/css/fc-presentation.min.css': ["dist/css/fc-presentation.css"]
    //     }
    //   }
    // }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // grunt.loadNpmTasks('grunt-contrib-less');
  // grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-ng-annotate');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'concat', 'ngAnnotate', 'uglify']);

};