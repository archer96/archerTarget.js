/*global module:false*/
module.exports = function (grunt) {

	'use strict';

	// Project configuration.
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		concat: {

			dist: {

				options: {
					banner: '/*!\n * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
						'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
						'<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
						' * Copyright (c) <%= grunt.template.today("yyyy") %>' +
						' <%= pkg.author.name %>;' +
						'\n * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n'
				},

				src: [
					'src/intro.js',
					'src/archerTarget.js',
					'src/lib/*.js',
					'src/outro.js'
				],

				dest: 'dist/<%= pkg.name %>.js'

			},

			targets: {

				options: {
					banner: '/*!\n * <%= pkg.title || pkg.name %> -' +
						' Targets - v<%= pkg.version %> - ' +
						'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
						'<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
						' * Copyright (c) <%= grunt.template.today("yyyy") %>' +
						' <%= pkg.author.name %>;' +
						'\n * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n'
				},

				src: [
					'src/intro.js',
					'src/targets/*.js',
					'src/outro.js'
				],

				dest: 'dist/targets/<%= pkg.name %>.targets.js'

			}

		},

		uglify: {

			dist: {

				files: {
					'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
				},
				options: {
					banner: '/*! <%= pkg.title || pkg.name %> | v<%= pkg.version %>' +
						' | <%= pkg.homepage ? pkg.homepage : "" %>' +
						' | (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>' +
						' | Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */ \n',
					sourceMap: 'dist/<%= pkg.name %>.min.map',
					beautify: {
						ascii_only: true
					},
					compress: {
						// don't show any warnings
						warnings: false,
						// DEBUGGER - remove console.log,...
						global_defs: {
							DEVMODE: false
						}
					}
				}
			},

			targets: {
				files: {
					'dist/targets/<%= pkg.name %>.targets.min.js': ['<%= concat.targets.dest %>']
				},
				options: {
					banner: '/*! <%= pkg.title || pkg.name %> - Targets | v<%= pkg.version %>' +
						' | <%= pkg.homepage ? pkg.homepage : "" %>' +
						' | (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>' +
						' | Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */ \n',
					sourceMap: 'dist/targets/<%= pkg.name %>.targets.min.map',
					beautify: {
						ascii_only: true
					}
				}
			}

		},

		jshint: {

			dist: {
				src: ['<%= concat.dist.dest %>'],
				options: {
					jshintrc: '.jshintrc'
				}
			},
			targets: {
				src: ['<%= concat.targets.dest %>'],
				options: {
					jshintrc: '.jshintrc'
				}
			},
			plugins: {
				src: ['src/plugins/*/*'],
				options: {
					jshintrc: '.jshintrc'
				}
			},
			grunt: {
				src: ['Gruntfile.js'],
				options: {
					jshintrc: '.jshintrc'
				}
			}

		},

		watch: {
			files: '<%= concat.dist.src %>',
			tasks: 'dev'
		}

	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('dev', ['concat:dist', 'jshint:dist']);

	// Default task.
	grunt.registerTask('default', ['concat', 'uglify', 'jshint']);

};
