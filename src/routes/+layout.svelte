<script lang="ts">
	import '../app.css';
	import {page} from "$app/state";
	import type {PageServerData} from "./$types";

	let { children, data }: {data: PageServerData, children: any} = $props();

	let tab_name = $derived(page.url.pathname.split("/")[1] ?? '');
	let nav_select = $derived({
		"quests": -2,
		"create": -1,
		"public": 1,
		"troop": 2,
	}[tab_name] ?? 0)

	let landing = $derived(page.url.pathname === "/");
	let auth = $derived(page.url.pathname === "/auth");
</script>

<svelte:head>
	<link rel="icon" href="/turtle.png" />
	<title>{tab_name} {tab_name ? '| ' : ''}questurtle </title>
</svelte:head>


<div class="min-h-screen flex flex-col items-center p-8 mb-64 relative">
	{#if !landing && !auth}
<!--		<div class="absolute right-20 bg-red-50 rounded-full py-2 px-4 italic text-gray-600 hover:text-gray-900"></div>-->
<!--		<div class="w-full max-w-96 aspect-[3/2] rounded-4xl">-->
<!--			<img src="/turtle.png" class="w-full h-full rounded-4xl" alt="Turtle" />-->
<!--		</div>-->
		<div class="flex items-center justify-between w-full line max-w-xl">
			<div class="flex gap-4">
						<div class="w-full max-w-12 rounded-4xl">
							<img src="/turtle.png" class="w-full h-full" alt="Turtle" />
						</div>
				<h1 class="text-4xl font-extrabold text-center">questurtle</h1>
			</div>
			<a class="block bg-red-50 py-2 px-4 rounded-lg" href="/logout"> Logout </a>
		</div>
		<div class="m-4 flex justify-center sticky w-full text-center ">
			<div class="flex-1 max-w-xl grid grid-cols-4">
				{#snippet tab(page, sel)}
					<a href="/{page}" class="-skew-x-12 bg-gray-200 py-2 {nav_select === sel ? 'z-10 scale-110 bg-gray-400' : ''} transition-colors duration-500">
						<p  class="skew-x-12 leading-7 underline decoration-[0.5px] hover:underline-offset-4 {nav_select === sel ? 'decoration-transparent font-semibold' : ''}">{page}</p>
					</a>
				{/snippet}
				{@render tab('quests', -2)}
				{@render tab('create', -1)}
				{@render tab('public', 1)}
				{@render tab('troop', 2)}
			</div>
		</div>
	{:else if !auth}
		<div>
			<a href="/auth" class="link"> Login </a>
		</div>
		<!--			is landing page-->
	{/if}
	{@render children?.()}
</div>