<script>
	import { createScope } from "../../../";

	let changeColor = false;

	const scope = createScope();

	$: css = scope.style({
		header: {
			$h1: {
				color: changeColor ? "red" : "blue",
			},
			$p: {
				color: () => {
					return "red";
				},
				"&somethingRandom": () => {
					return {
						border: "1px solid orange",
					};
				},
			},
		},
		button: {
			background: "green",
		},
	});
</script>

<div class={css.header}>
	<h1>Hello there!</h1>
	<p>this</p>
</div>

<button class={css.button} on:click={() => (changeColor = !changeColor)}>change color</button>
