module.exports = function(grunt) {

	grunt.initConfig({
		watch: {
			gruntfile: {
				files: 'Gruntfile.js',
				tasks: ['default'],
			},
			scripts:{
				files: 'dev/js/**/*.js',
			    tasks: ['concat:js', 'uglify'],
			},
			src: {
				files: 'dev/views/**/*',
				tasks: ['concat:dist', 'copy'],
			},
			styles: {
		        files: ['dev/less/styles.less'], // which files to watch
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
			files:{
				cwd: 'dev/views',
				src: ['**/*.html', '!comps/*.html'],
				dest: 'public/views',
				expand: true,
				flatten: true,
				filter: 'isFile'

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


	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	// Register the default task.
	grunt.registerTask("default", [ 
		"concat", 
		"uglify", 
		"copy", 
		"cssmin"
	]);


};
