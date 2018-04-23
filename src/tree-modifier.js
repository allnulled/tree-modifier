(function() {
	var output = (function() {
		return {
			/**
			 * @name TreeModifier.generate
			 * @type {Function}
			 * @param optionsParam {Object} Accepts properties:
			 * 		- switcher {Array<String:label,Function:filter}:
			 *		  List of pairs name-filter that associates a 
			 * 		  type of modifier and the function that 
			 * 		  filters the valid items for this grammar.
			 * 		- modifier: {Object<Function:modifier>} Map
			 * 		  that associates a grammar with a modifier,
			 * 			which is a function that outputs a new value.
			 * @returns {Object} Object with a property "modify",
			 * which corresponds to the generated tree-modifier
			 * function, that accepts any type of data, and outputs
			 * the same, but modified as we have specified
			 * previously.
			 * @description The function creates a JS data-parser,
			 * which is a function that will accept any type of 
			 * data, and it will output the same, but modified as
			 * specified in the rules (the optionsParam.switcher and 
			 * optionsParam.modifier represent this rules).
			 * By default, the generated parser has 3 basic rules,
			 * which are automatically appended to the parser:
			 * 		1. ARRAY: 
			 *			- switcher: filters all the arrays.
			 * 			- modifier: iterates its items, and returns 
			 * 			them modified. The result is the same array, 
			 * 			but modified.
			 * 		2. OBJECT: 
			 *			- switcher: filters all the objects (except the 
			 * 			arrays, which are filtered by the previous one).
			 * 			- modifier: iterates its items, and returns 
			 * 			them modified. The result is the same object, 
			 * 			but modified.
			 * 		3. ANY: 
			 *			- switcher: filters any type of data.
			 * 			- modifier: returns the same data.
			 */
			generate: function(optionsParam) {
				var options = Object.assign({}, {
					switcher: [],
					modifier: {}
				}, optionsParam);
				var scope = {};
				scope.modify = function(data) {
					var switchers = [].concat(options.switcher).concat([
						["ARRAY", (item) => item instanceof Array],
						["OBJECT", (item) => typeof item === "object"],
						["ANY", (item) => true],
					]);
					var modifiers = Object.assign({}, {
						ARRAY: function(item) {
							var out = [];
							var scope = this;
							item.forEach(function(it) {
								var value = scope.modify(it);
								out.push(value);
							});
							return out;
						},
						OBJECT: function(item) {
							var out = {};
							var scope = this;
							for (var p in item) {
								var value = scope.modify(item[p]);
								out[p] = value;
							}
							return out;
						},
						ANY: function(item) {
							return item;
						}
					}, options.modifier);
					for (var a = 0; a < switchers.length; a++) {
						var switcher = switchers[a];
						var id = switcher[0];
						var switcher = switcher[1];
						var isValid = switcher.call(scope, data);
						if (isValid) {
							var modifier = modifiers[id];
							if (typeof modifier !== "function") {
								throw {
									name: "UnknownTreeModifierFunction",
									message: "The tree-modifier function choosen is not available (id: " + id + ")"
								}
							}
							return modifier.call(scope, data);
						}
					}
					return data;
				};
				return scope;
			}
		};
	})();
	if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
		module.exports = output;
	} else if (typeof define === "function" && typeof define.amd !== "undefined") {
		define([], () => output);
	} else {
		window[arguments[0]] = output;
	}
})("TreeModifier");