module.exports = function ( grunt ) {

    var srcCoffee = "src/coffee/";

	var coffeesToWatch = null;
	var filesToWatch = null;

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-stylus');

	grunt.event.on( "watch", function( action, filepath ) {
        var fileType = getFileType( filepath );
        if( fileType == "coffee" ) {
            getCoffees();
            initConfig();
        }
    });


    function getFileType( filepath ) {
        return filepath.split( "." ).pop();
    }

    function getCoffees() {
        coffeesToWatch = [ srcCoffee + "*.coffee" ];

        grunt.file.recurse( srcCoffee, function( abspath, rootdir, subdir, filename ) {
            if( subdir == undefined )
                return;
            coffeesToWatch[ coffeesToWatch.length ] = srcCoffee + subdir + "/*.coffee";
        });

        coffeesToWatch.reverse();
    }


	function grabFilesToWatch() {
		var baseCoffee = "./src/coffee/";
		
		coffeesToWatch = [ baseCoffee + "*.coffee" ];
		
		grunt.file.recurse( baseCoffee, function(abspath, rootdir, subdir, filename) {
			if( subdir == undefined )
				return;
			coffeesToWatch[ coffeesToWatch.length ] = baseCoffee + subdir + "/*.coffee";
		});

		coffeesToWatch.reverse();

		filesToWatch = [ "GruntFile.js" ].concat( coffeesToWatch );
	}

	function initConfig() {
		grunt.initConfig( {
			pkg: grunt.file.readJSON('package.json'),

			watch: {
                coffee: {
                    files: [ "src/coffee/**/*.coffee" ],
                    tasks: [ "coffee:compile" ]
                },
                stylus: {
                    files: [ "src/stylus/**/*.styl" ],
                    tasks: [ "stylus" ]
                },
			},

			coffee: {
				compile: {
					options: {
						bare: true
					},
					files: {
						"./www/js/main.js" : coffeesToWatch
					}
				}
			},

			stylus: {
                dist: {
                    options: {
                    	paths: "src/stylus/**/*.styl",
                        compress: false
                    }
                },
				compile : {
					files : {
						'./www/css/main.css' : 'src/stylus/**/*.styl'
					}
				}
            },

			uglify: {
				main: {
					options: { 
						beautify: false
					},
					files: {
						"./www/js/main.min.js": [ "./www/js/plugins.js", "./www/js/vendors/jquery-2.0.3.min.js", "./www/js/vendors/greensock/TweenMax.min.js", "./www/js/main.js" ]
					}
				}
			},

			cssmin: {
				main: {
					files: {
						"./www/css/main.min.css": [ "./www/css/reset.css", "./www/css/main.css" ]
					}
				}
			},

            imagemin: {
                dynamic: {
                    options: {
                        optimizationLevel: 7
                    },
                    files: [ {
                        expand: true,
                        cwd: "www/img/",
                        dest: "www/img/",
                        src: [ "**/*.{png,jpg}"]
                    }]
                }
            }
		});

	}

    grunt.registerTask( "compile", [ "coffee:compile", "stylus:compile" ] );
    grunt.registerTask( "imageoptim", [ "imagemin:dynamic" ] );
    grunt.registerTask( "all", [ "compile", "uglify", "imageoptim", "cssmin" ] );
	grunt.registerTask( "default", ["compile", "watch"] );
	grabFilesToWatch();
	initConfig();

}