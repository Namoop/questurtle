<script lang="ts">
    import { enhance } from '$app/forms';

    import type {PageServerData} from "./$types";

    let {data }: {data: PageServerData, } = $props();

    let quests = $derived(data.my_quests) as Quest[];
</script>

<form method="post" use:enhance>
    <button class="bg-blue-500 text-white p-2 cursor-pointer" formaction="?/create">
        Create New Quest
    </button>
</form>


<div class="py-8 w-md">
{#each quests as quest}
    <div class="bg-white p-4 rounded shadow mb-4">
        <h2 class="text-xl font-bold">{quest.name}</h2>
        <p>{quest.description}</p>
        <a class="link" href="/create/{quest.id}">Edit quest</a>
    </div>
{/each}
</div>