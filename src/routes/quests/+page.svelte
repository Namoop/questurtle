<script lang="ts">
    import { enhance } from '$app/forms';

    import type {PageServerData} from "./$types";

    let {data}: {data: PageServerData, } = $props();

    let quests = $derived(data.quests || []) as Quest[];
    let shared = $derived(data.shared || []) as Quest[];

    let shared_modal_show = $state(false)

    async function acceptQuest(id: string) {
        const form = new FormData();
        form.append('questId', id);
        const result = await fetch('?/accept', {
            method: 'POST',
            body: form
        });
        if (result.ok) {
            // Remove the quest from the shared list and add to quests
            const quest = shared.find(q => q.id === id);
            if (quest) {
                quests = [...quests, quest];
                shared = shared.filter(q => q.id !== id);
                shared_modal_show = false;
            }
        }
    }
</script>

{#if shared.length > 0}
    <div class="relative p-2">
        <button class="bg-blue-500 text-white font-semibold p-4 rounded-lg" onclick={()=>shared_modal_show = true}>Shared With You</button>
        <div class="absolute top-0 right-0 bg-gray-800 text-white rounded-full w-6 h-6 text-center">{shared.length}</div>
    </div>
{/if}

{#if shared_modal_show}
    <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onclick={() => shared_modal_show = false}>
        <div class="bg-white p-6 rounded-lg max-w-md w-full relative" onclick={(event)=>event.stopPropagation()}>
            <h2 class="text-2xl font-bold mb-4">Quests Shared With You</h2>
            <button class="absolute top-2 right-2 text-gray-600 hover:text-gray-900">✖</button>
            {#each shared as quest}
                <div class="border border-gray-100 p-4 rounded shadow mb-4">
                    <div class="flex items-baseline gap-2">
                    <h3 class="text-xl font-bold">{quest.title}</h3>
                    <span class="italic text-sm">by <span class="font-semibold">{quest.author}</span></span>
                    </div>
                    <p class="mb-2">{quest.description}</p>
                    <button class="bg-green-500 text-white font-semibold p-2 rounded-lg" onclick={()=>acceptQuest(quest.id)}>Accept quest</button>
                </div>
            {/each}
        </div>
    </div>
{/if}

<div class="py-8 w-md">
    {#if quests.length === 0}
        <p class="text-center text-gray-500">You have no quests yet. Find one in the public tab!</p>
    {:else}
        <h1 class="text-2xl font-bold mb-4">Your Quests</h1>
    {/if}
    {#each quests as quest}
        <div class="bg-white p-4 rounded shadow mb-4">
            <h2 class="text-xl font-bold">{quest.name}</h2>
            <p>{quest.description}</p>
            <a class="link" href="/quests/{quest.id}">Open quest</a>
        </div>
    {/each}
</div>