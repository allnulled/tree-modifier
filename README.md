# tree-modifier

The `tree-modifier` is a small JavaScript tool to modify any piece of data recursively.

# 1. Installation 

`~$ npm install -s tree-modifier`

# 2. Usage

### General:

The tool only needs to know:

   1. *What to modify.*

   2. *How to modify it*.

### Steps:

1. Generate the tree-modifier object.

2. Transform the data we want.

### All-in-1 example:

```js
var result = require("tree-modifier").generate({
	switcher: [
		["STRINGS", function(item) {return typeof item === "string"}]
		["NUMBERS", function(item) {return typeof item === "number"}]
	],
	modifier: {
		STRINGS: function(item) {return "Hello world!"},
		NUMBERS: function(item) {return 255}
	}
}).modify({
	first: "Text 1"
	second: 1000
});
```

The output is stored in `result` variable. It will be something like:

```js
{
  first: "Hello world!",
  second: 255
}
```

# 3. How it works

It is very simple. 

First we define some rules to `match` (switchers) and to `replace` (modifiers). Then we pass any type of data. Finally, we obtain the data, but modified as we wanted.

There are 3 initial rules applied, and everything that we write, will have priority over them. By default, the 3 rules are, in this order:

- `ARRAY`: takes any `instance of Array`, iterates through its items, and modifies them one by one (despite we do not know the other rules being applied).

- `OBJECT`: takes any `type of "object"`, iterates through its items, and modifies them one by one (despite we do not know the other rules being applied).

- `ANY`: takes anything, and returns the same value.

As the precedence of these rules can change the result, and the objects in JavaScript are not necessarily iterated by any order, the API requires the `switchers` to be specified as an array with (1) the name of the modifier applied, and (2) the filter function, which receives the item, and returns `true` or `false` depending if the item must be modified by that modifier, or not. This is because this way, we define the order too.

# 4. API

#### General usage: 

```js
require("tree-modifier")
   .generate(Object:options)
   .modify(Any:data)
```

----

#### Method: `{TreeModifier}.generate(Object:options)`

**Parameter:** `Object:options`. Rules for the tree-modifier. Accepts 2 properties:

`switcher`: `{Array<Array<String:name,Function:filter>>}` List of arrays composed by `<{name:String},{filter:Function}>`. The first item `{name:String}` represents the name of the modifier that must be applied to the data when the second item `{filter:Function}`, when we pass the iterated data, returns `true`.

`modifier`: `{Object<Function:modifier>}` Map of modifiers. Each modifier is a function that receives the piece of data to be modified, and returns the result of the modification. The returned value will be the new value of that piece of data, after being modified. 

*Note:* Every modifier is called using the same scope. That scope lets you modify values (while one is defining the modification of another value), through `this.modify(Any:data)`.

**Returns:** `{Object:GeneratedTreeModifier:modifier}` Object that has the method `modify(Any:data)`.

----

#### Method: `{GeneratedTreeModifier}.modify(Any:input)`

**Parameter:** `Any:input` Any type of data is a valid input.

**Returns:** `{Any:output}` It will return the data, but modified as we have specified in the previous rules.
 
----

# 5. Conclusion

It is a very specific utility, but it can be very helpful when we need to change some piece of data recursively, and we have some complexity in our source code, because it lets you do a powerful match-replace through any type of data, in a very minimalistic expression of code.# Read this filele