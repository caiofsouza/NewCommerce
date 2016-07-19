module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({

		shell: {
			options: {
				stderr: false
			},
			multiple: {
				command: [  
							'cd api',
							'sudo npm install',
							'cd ..',
							'pm2 kill',
							'pm2 start server.js',
							'pm2 start api/api.js',
							'pm2 list'

						].join('&&')
			}
		},

		watch: {
			gruntfile: {
				files: ['Gruntfile.js'],
				tasks: ['default'],
			},
			scripts:{
				files: ['dev/js/**/*.js'],
			    tasks: [ 'concat:js', 'uglify' ],
			},
			src: {
				files: [ 'dev/views/**/*'],
				tasks: ['concat:dist', 'copy'],
			},
			styles: {
		        files: [ 'dev/less/styles.less' ], // which files to watch
		        tasks: ['less', 'cssmin'],
		        options: {
		        	nospawn: true
		        }
		    }
		},
		concat: {
			js: {
				src: ['dev/js/app.js', 'dev/js/controllers/*.js', 'dev/js/models/*.js', 'dev/js/scripts.js'],
				dest: 'dev/js/all_app.js',
			},
			dist:{
				src: ['dev/views/comps/header.html', 'dev/views/comps/footer.html'],
				dest: 'public/index.html',
			}
		},
		copy: {
			main: {
				files: [
				{
					cwd: "dev/views",
					src: ['**/*.html', '!comps/*.html'],
					dest: 'public/views',
					expand: true,
					flatten: true,
					filter: 'isFile'
				},
				{
					cwd: "bower_components",
					src: [	
						'angular/angular.min.js',
						'angular/angular.min.js.map',
						'angular-cookies/angular-cookies.min.js',
						'angular-cookies/angular-cookies.min.js.map',
						'angular-input-masks/angular-input-masks-standalone.min.js',
						'angular-input-masks/angular-input-masks-standalone.min.js.map',
						'angular-route/angular-route.min.js',
						'angular-route/angular-route.min.js.map',
						'angular-sanitize/angular-sanitize.min.js',
						'angular-sanitize/angular-sanitize.min.js.map',
						'ng-file-upload/ng-file-upload.min.js',
						'ng-file-upload/ng-file-upload-shim.min.js',
						'jquery/dist/jquery.min.js'
						],
					dest: 'public/plugins',
					expand: true,
					flatten: true,
					filter: 'isFile'
				}]
			}
		},
		uglify: {
			options: {
	            mangle: false
	        },
			build: {
				src: 'dev/js/all_app.js',
				dest: 'public/js/app.min.js'
			}
		},
		less: {
			development: {
				options: {
					paths: ["assets/css"]
				},
				files: {"dev/less/styles.css": "dev/less/styles.less"}
			},
			production: {
				options: {
					paths: ["assets/css"],
					cleancss: true
				},
				files: {"dev/less/styles.css": "dev/less/styles.less"}
			}
		},
		cssmin: {
			options: {
				shorthandCompacting: false,
				roundingPrecision: -1
			},
			target: {
				files: {
					'public/css/styles.min.css': ['dev/less/styles.css']
				}
			}
		}
	});


	grunt.registerTask("default", [ "concat", "uglify", "copy", "cssmin"]);
	grunt.registerTask("build", [ "default", "shell", "watch"]);

};
