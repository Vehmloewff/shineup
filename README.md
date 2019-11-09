# shineup

A simple and flexible css-in-js implementation for [Svelte](https://svelte.dev).

## Installation

```sh
npm i shineup
```

## Brief Overview

No complex setup or installation is neccesary. Just import and go:

```html
<script>
	import { createStyles } from "shineup";

	$: css = createStyles({
		color: "red",
	});
</script>

<div class="{css}" />
```

If you have more than one component it is recomended that you scope them:

```html
<script>
	import { createScope, ready } from "shineup";

	const scope = createScope();

	$: css = scope.style({
		color: "red",
	});

	ready();
</script>

<div class="{css}" />
```

or

```html
<script>
	import { createStyles } from "shineup";

	$: css = createStyles(
		{
			color: "red",
		},
		"something-that-is-different-with-each-component"
	);

	ready();
</script>

<div class="{css}" />
```

You can define as many classes as you need:

```html
<script>
	import { createScope } from "shineup";

	const scope = createScope();

	$: css = scope.style({
		background: {
			height: "50px",
			width: "200px",
		},
		foreground: {
			background: "green",
			transition: "background 0.5s",
			$h1: {
				color: "red",
			},
			":hover": {
				background: "red",
			},
		},
	});

	ready();
</script>

<div class="{css.background}" />
<!-- or -->
<div class="{css.get('background')}" />

<div class="{css.foreground}">
	<h1>Hello World!</h1>
</div>
```

## API

### createScope(): object

Returns a `{ style }` object.

#### style(obj: object): object|string

Creates a stylesheet and appends it to the DOM. If this function is called after the stylesheet has been added to the DOM that stylesheet will just be updated.

`obj` is passed directly to [`parseJS`](#parsejs).

The result of this function will be either a string, or an object with each key as a string and a `get(class: string)` method. These strings are intended to be plugged right into your template as the class name of the element you want to modify.

Example with a string returned:

```html
<script>
	import { createScope } from "shineup";

	const scope = createScope();

	$: css = scope.style({
		color: "red",
	});
</script>

<div class="{css}" />
```

Example with an object returned:

```html
<script>
	import { createScope } from "shineup";

	const scope = createScope();

	$: css = scope.style(
		header: {
			color: "red",
		},
		button: {
			color: "blue",
		}
	);

	ready();
</script>

<div class="{css.header}">Header</div>
<button class="{css.button}">Button</button>
```

### createStyles(obj: object, key?: string): object|string

Almost the same as `createScope().style`. The only difference is that with this method, a `key` option is passed in.

`key` is an string used to for scoping. Default is `"my-component"`.

### parseJS(obj: object): object

Parses `obj` into an object whose keys and values are valid css.

`shineup` revolves around the use of classes. While traditional CSS frameworks provide a myrmaid of classes that you can assign to your elements, this package is aimed at making it easy to have one class per component, and then you can dynamicly assign styles to that class.

All keys are allowed to be in the camel case (`boxShadow`) or hyphenated (`box-shadow`) formats.

Returns a `{ css, classes }` object.

-   `css` is just a valid css version of `obj`.
-   `classes` is an object that contains all of the classes in `obj` (if `obj` does not contain an classes `shineup` will assign it to `default` class) linked to their selector.

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

Example:

```js
attachStyles({
	".something": {
		border: "1px solid black",
	}
	".other": {
		border: "1px solid blue",
	}
}, "some-key")
```

## Can I contribute?

Sure!

Fork repo. Then...

```sh
git clone https://github.com/[your-username]/shineup
cd shineup
npm setup

npm test -- --watch
```

To run the test app:

```sh
npm run test:browser
```

Issues and PR's are welcome!

Don't forget to `npm run lint` before commiting!

## License

[MIT](/LICENSE)
