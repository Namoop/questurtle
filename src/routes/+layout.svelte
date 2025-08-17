<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import {page} from "$app/state";
	import type {PageServerData} from "./$types";

	let { children, data }: {data: PageServerData, children: any} = $props();

	let nav_select = $derived({
		"quests": -2,
		"create": -1,
		"public": 1,
		"troop": 2,
	}[page.url.pathname.split("/")[1]] ?? 0)

	let user = $state(data?.user);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="bg-amber-200 min-h-screen flex flex-col items-center p-8">
	{#if user}
		<div class="w-96 h-64 bg-red-200">
		</div>
		<div class="flex flex-row gap-20 p-4 sticky transition-all duration-300">
			<a href="/quests" class="leading-7 underline decoration-[0.5px] hover:underline-offset-4 {nav_select === -2 ? 'decoration-transparent font-semibold' : ''}">quests</a>
			<a href="/create" class="leading-7 underline decoration-[0.5px] hover:underline-offset-4 {nav_select === -1 ? 'decoration-transparent font-semibold' : ''}">create</a>
			<a href="/public" class="leading-7 underline decoration-[0.5px] hover:underline-offset-4 {nav_select ===  1 ? 'decoration-transparent font-semibold' : ''}">public</a>
			<a href="/troop"  class="leading-7 underline decoration-[0.5px] hover:underline-offset-4 {nav_select ===  2 ? 'decoration-transparent font-semibold' : ''}">troop</a>
		</div>
	{:else}
<!--			is landing page-->
	{/if}
	{@render children?.()}
</div>