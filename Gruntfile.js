module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-contrib-concat");

  grunt.initConfig({
      concat: {
        dist: {
            src: ["src/a.js", "src/b.js"]
          , dest: "dist/app.js"
        }
      }
  });
};