module.exports = function(grunt) {

	grunt.initConfig({
		watch: {
			gruntfile: {
				files: 'Gruntfile.js',
				tasks: ['jshint:gruntfile'],
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
				src: 'dev/js/app.js',
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
		}
	});



	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');

	// Register the default task.
	grunt.registerTask("default", ["uglify", "watch", "less"]);
};
