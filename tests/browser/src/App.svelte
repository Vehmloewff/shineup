<script>
	import { createStyles, ready } from "../../../";

	let changeColor = false;

	$: css = createStyles({
		header: {
			$h1: {
				color: changeColor ? "red" : "blue",
			},
			$p: {
				color: "red",
			},
			color: "black",
		},
		button: {
			background: "green",
		}
	});

	ready();
</script>

<div class={css.header}>
	<h1>Hello there!</h1>
	<p>this</p>
</div>

<button class={css.button} on:click={() => (changeColor = !changeColor)}>change color</button>
