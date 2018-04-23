var TreeModifier = require(__dirname + "/../src/tree-modifier.js");

var modifier = TreeModifier.generate({
	switcher: [
		[
			"SPECIAL_DATA",
			function(item) {
				return typeof item === "object" && Object.keys(item).length === 1 && "$" in item
			}
		]
	],
	modifier: {
		SPECIAL_DATA: function(item) {
			var value = item.$;
			var out = value.base;
			value.extension = [].concat(value.extension);
			for (var a = 0; a < value.extension.length; a++) {
				var extension = value.extension[a];
				for (var property in extension) {
					out[property] = this.modify(extension[property]);
				}
			}
			return out;
		}
	}
});

var $ = modifier.modify({
	do: {
		not: {
			believe: {
				$: {
					base: function(something = 0) {
						return parseFloat("-" + something);
					},
					extension: [{
						something: function(something) {
							return something;
						},
						nothing: function(something) {
							return 0;
						}
					}]
				}
			}
		}
	},
	believe: {
		$: {
			base: function(something = 0) {
				return parseFloat("-" + something);
			},
			extension: [{
				something: function(something) {
					return something;
				},
				nothing: function(something) {
					return 0;
				}
			}]
		}
	}
});

console.log("(*) Expect that everything is 'true':");
console.log(
	(typeof $.do === "object") + ": $.do" + "\n" +
	(typeof $.do.not === "object") + ": $.do.not" + "\n" +
	(typeof $.do.not.believe === "function") + ": $.do.not.believe" + "\n" +
	(typeof $.do.not.believe(1) === "number") + ": $.do.not.believe(1)" + "\n" +
	(typeof $.do.not.believe.something === "function") + ": $.do.not.believe.something" + "\n" +
	(typeof $.do.not.believe.something(1) === "number") + ": $.do.not.believe.something(1)" + "\n" +
	(typeof $.do.not.believe.nothing === "function") + ": $.do.not.believe.nothing" + "\n" +
	(typeof $.do.not.believe.nothing(1) === "number") + ": $.do.not.believe.nothing(1)" + "\n" +
	(typeof $.believe === "function") + ": $.believe" + "\n" +
	(typeof $.believe(1) === "number") + ": $.believe(1)" + "\n" +
	(typeof $.believe.something === "function") + ": $.believe.something" + "\n" +
	(typeof $.believe.something(null) === "object") + ": $.believe.something(null)" + "\n" +
	(typeof $.believe.nothing === "function") + ": $.believe.nothing" + "\n" +
	(typeof $.believe.nothing(1) === "number") + ": $.believe.nothing(1)" + "\n"
);
