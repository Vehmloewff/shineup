# shineup

An easy and flexibile css-in-js implementation for [Svelte](https://svelte.dev).

Powerfull, effiecent, easy, and complete with [plugin](#plugins) support.

## Installation

```sh
npm i shineup -D
```

There is no need to install it as `dependency` because it will be bundled with rollup, or webpack, or whatever bundler you use.

## Brief Overview

### Easy

No complex setup or installation is neccesary. Just import and go:

```html
<script>
	import { createStyles } from "shineup";

	$: css = createStyles(
		{
			color: "red",
		},
		"my-component"
	);
</script>

<div class="{css}" />
```

### Scaleable

You can define as many classes as you need:

```html
<script>
	import { createStyles, createKey } from "shineup";

	const key = createKey();

	$: css = createStyles(
		{
			background: {
				height: "50px",
				width: "200px",
				// ...
			},
			foreground: {
				background: "green",
				transition: "background 0.5s",

				// Keys starting with a `$` will be appended
				// onto the parent selector.
				"$ h1": {
					color: "red",
				},
				"$:hover": {
					background: "red",
				},
			},
		},
		key
	);
</script>

<div class="{css.background}" />
<!-- or -->
<div class="{css.get('background')}" />

<div class="{css.foreground}">
	<h1>Hello World!</h1>
</div>
```

### Efficenct

Plugins just increase productivity:

```html
<script>
	import { createStyles, get } from "shineup";

	$: css = createStyles(
		{
			...get("cover")(3, {
				fixed: true,
			}),
			...get("scrollable")(),
			...get("scrollbar")({
				thumb: {
					color: "red",
				},
			}),
		},
		"my-component"
	);
</script>

<div class="{css}" />
```

NOTE: Before a plugin can be used, it must be [initialized](#plugins).

## API

### createStyles(obj: object, key: string): object | string

Create a stylesheet and append it to the DOM. If this function is called after the stylesheet has been added to the DOM it will just be updated.

`obj` must match the requirements of [Input Object](#input-object).

The `key` is the unique indentifier used to avoid conflicts.

The result of this function will be either a string, or an object with each key as a string and a `get(class: string)` method. These strings are intended to be plugged right into your template as the class name of the element you want to modify.

Example:

```html
<script>
	import { createStyles } from "shineup";

	$: css = createStyles(
		{
			color: "red",
		},
		"my-component"
	);
</script>

<div class="{css}" />
```

### parseJS(obj: object): object

Parses `obj` into an object whose keys and values are valid css.

`shineup` revolves around the use of classes. While traditional CSS frameworks provide a myrmaid of classes that you can assign to your elements, this package is aimed at making it easy to have one class per component, and then you can dynamicly assign styles to that class.

All keys are allowed to be in the camel case (`boxShadow`) or hyphenated (`box-shadow`) formats.

Examples:

```js
{
	"headerInner": {
		"color": "red"
	}
}

// ->
{
	".header-inner": {
		"color": "red"
	}
}
```

Any keys values of type object will be appended onto the parent selector (`$` can optionally replace the space character ``).

```js
{
	"headerInner": {
		"color": "red",
		"$h1": {
			"color": "green"
		},
		":hover": {
			"boxShadow": "2px 2px 2px 2px black"
		}
	}
}

// ->
{
	".header-inner": {
		"color": "red"
	},
	".header-inner h1": {
		"color": "green"
	}
}
```

Any values of type `function` will be called with a `{ obj: object, parent: object, key: string, id: string, className: string, querySelector: string }` paramater.

```js
{
	"headerInner": {
		color: "red",
		boxShadow: ({ parent, key }) => {
			if (!parent.boxShadow && !parent["box-shadow"]) {
				return "2px 2px 2px 2px black";
			}
		}
	}
}

// ->
{
	".header-inner": {
		"color": "red",
		"box-shadow": "2px 2px 2px 2px black",
	}
}
```

Any keys that start with an `&` symbol and whose value is of type `function` will be called just like in the previous example, except, the returned value will be merged into the parent value.

This example will produce the same output as the above example:

```js
{
	"headerInner": {
		color: "red",
		"&boxShadow": ({ parent, key }) => {
			if (!parent.boxShadow && !parent["box-shadow"]) {
				return {
					boxShadow: "2px 2px 2px 2px black",
				}
			}
		}
	}
}
```

### attachStyles(obj: object, key: string): void

Stringifys the `obj` paramater, which should be valid css keys and values, to the head. If this function is called twice with the same key, it will override an existing `style` element instead of creating a new one.

### get(plugin: string): any

Returns a plugin registered with the [`add`](#add) method.

### registerPlugin(name: string, plugin: function, options: object): void

Adds a plugin. For more information see [developing a plugin](developing-a-plugin).

`options` is an object that can contain the following properties:

### \$: object

This object is populated with all the registered plugins.

While you can use [`get`](#get) to get a plugin, it is shorter to just do something like this:

```html
<script>
	import { createStyles, $ } from "shineup";

	$: css = createStyles(
		{
			...$.cover(3, {
				fixed: true,
			}),
			...$.scrollable(),
			...$.scrollbar({
				thumb: {
					color: "red",
				},
			}),
		},
		"my-component"
	);
</script>

<div class="{css}" />
```

## Plugins

Use plugins via [`get`](#get), or [`$`]($). [Here](#efficenct) is an example.

Refer to the README of each plugin for instructions on how to initialize it.

### Developing a plugin

At it's core, a plugin is just a function that returns an object:

```js
function myPlugin() {
	return {
		color: "red",
	};
}
```

After your plugin is defined it will need to be added to the main package:

```js
import { registerPlugin } from "shineup";

function myPlugin() {
	return {
		color: "red",
	};
}

registerPlugin(`myPlugin`, myPlugin);
```

It is recomended to have your plugin export a function that creates and registers itself.

```js
module.exports = ({ registerPlugin }) => {
	function myPlugin() {
		return {
			color: "red",
		};
	}

	registerPlugin(`myPlugin`, myPlugin);
};
```

Then the user just has to:

```js
import * as shineup from "shineup";
import color from "shineup-plugin-color";

color(shineup);
```

NOTE: One plugin can register multipile functions.

#### Naming conventions

If you develop a plugin, it is recomended to name it `shineup-plugin-[name]`.

## Can I contribute?

Sure!

```sh
git clone https://github.com/[your-username]/shineup
cd shineup
npm i
npm test -- --watch
```

Issues and PR's are welcome!

Don't forget to `npm run lint` before commiting!

## License

[MIT]()
