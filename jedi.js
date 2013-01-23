(function (window, undefined) {
	'use strict';

	//Methods of dependncy annotation:
	//1. function target(dep1, dep2) {} //will fail until minification
	//2. var target = ["dep1", "dep2", function(dep1, dep2) {}]
	//3. function target(dep1, dep2) {}; target.$dependencies = ["dep1", "dep2"]

	var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;

	var factories = {};

	//todo: add abilit to inject not only the first arguments of the function 
	//e.g.: "dep1", "dep2", "*", "dep3", "*", "*", "dep4"
	//where: 
	//	- dep* - dependencies which would be injected
	//	* - placeholder to put parameters 
	//for example:
	//	function target(dep1, str, dep2, number, dep3) {}
	//	var target = jedi.process(target) 
	//dep1, dep2 and dep3 would be injected. New function will have this signature - function target (str, number).
	var getDependencies = function (arr) {
		var deps = [];
		for(var i = 0; i < arr.length; i +=1){
			var factory = factories[arr[i]];
			if(factory !== null && factory !== undefined) {
				deps.push(factory);
			} else {
				break;
			}
		}
		return deps;
	};

	window.jedi = {
		instantinate: function () {
			//inject deps and call target as a constructor
		},
		call: function () {
			//inject deps and call target as a function
		},
		process: function (target) {
			//create function wich will call target with injected deps
			var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
			var FN_ARG_SPLIT = /,/;
			var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
			var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
			var text = target.toString();
			var args = text.match(FN_ARGS)[1].split(','); // todo: trim each argument 

			var deps = getDependencies(args);
			return function caller () {
				if(this instanceof caller){
					//function called as a constructor
				}

				var args = Array.prototype.splice.call(arguments, 0);
				if(args.length > 0) {
					deps = deps.concat(args);
				}

				return target.apply(target, deps);
			};

		},
		factory: function (name, factory) {
			factories[name] = factory; //todo: inject dependencies to factory methods
		}
	};
})(window, undefined);
