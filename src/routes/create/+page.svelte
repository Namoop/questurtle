<script lang="ts">
    import {enhance} from '$app/forms';

    import type {PageServerData} from "./$types";

    let {data }: {data: PageServerData, } = $props();

    let quests = $derived(data.my_quests) as Quest[];

    async function confirmDelete({formData, cancel}: {formData: FormData, cancel: Function}) {
        const questId = formData.get('questId') as string;
        if (!confirm("Are you sure you want to delete this quest? This action cannot be undone.")) {
            cancel(); return;
        }
        document.getElementById('card-' + questId)!.classList.add('animate-pulse');
        return async ({update}: {update: Function}) => {
            await update();
            document.querySelector('.animate-pulse')?.classList.remove('animate-pulse');
        }
    }

    async function awaitCreate() {
        const button = document.querySelector('#createButton') as HTMLButtonElement;
        button.disabled = true;
        return async ({update}: {update: Function}) => {
            await update();
            button.disabled = false;
        }
    }
</script>

<form method="post" use:enhance={awaitCreate} action="?/create">
    <button id="createButton" class="bg-blue-500 text-white p-2 cursor-pointer disabled:bg-gray-300">
        Create New Quest
    </button>
</form>


<div class="py-8 max-w-md w-full">
    {#each quests as quest}
        <div id="card-{quest.id}" class="border border-gray-100 p-4 rounded shadow mb-4 relative">
            <h2 class="text-xl font-bold">{quest.title}</h2>
            <p class="line-clamp-3">{quest.description}</p>
            <a class="link" href="/create/{quest.id}">Edit quest</a>
            <form method="post" use:enhance={confirmDelete} action="?/delete">
                <input type="hidden" name="questId" value="{quest.id}">
            <button type="submit" class="absolute top-4 right-4 cursor-pointer" aria-label="Delete">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600 hover:text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
            </form>
        </div>
    {/each}
</div>