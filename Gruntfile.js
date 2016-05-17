module.exports = function(grunt) {

	grunt.initConfig({
		clean: {
            build: {
                dot: true,
                src: [ 'dev/js/all_app.js', 'dev/views/all.html', 'public/views/' ]
            }
        },
		concat: {
			js: {
				src: ['dev/js/app.js', 'dev/js/controllers/*.js', 'dev/js/models/*.js'],
				dest: 'dev/js/all_app.js',
			},
			dist:{
				src: ['dev/views/header.html', 'dev/views/footer.html'],
				dest: 'public/index.html',
			}
		},
		watch: {
			gruntfile: {
				files: 'Gruntfile.js',
				tasks: ['default'],
			},
			src: {
				files: ['dev/**/*'],
				tasks: ['default'],
			},
			styles: {
		        files: ['dev/less/styles.less'], // which files to watch
		        tasks: ['less'],
		        options: {
		        	nospawn: true
		        }
		    }
		},
		uglify: {
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
				files: {"public/css/styles.css": "dev/less/styles.less"}
			},
			production: {
				options: {
					paths: ["assets/css"],
					cleancss: true
				},
				files: {"public/css/styles.css": "dev/less/styles.less"}
			}
		},
		copy: {
			files:{
				cwd: 'dev/views/',
				src: '*.html',
				dest: 'public/views/',
				expand: true 
			}
		}
	});


	grunt.loadNpmTasks('grunt-contrib-clean' );
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');

	// Register the default task.
	grunt.registerTask("default", [ "clean", "concat", "uglify", "less", "copy", "watch"]);
};
