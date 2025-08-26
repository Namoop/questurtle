<script lang="ts">

    import type {PageServerData} from "./$types";
    import { enhance } from '$app/forms';
    import { onMount } from 'svelte';
    import {page} from "$app/state";
    import {replaceState} from "$app/navigation";

    let {data}: { data: PageServerData } = $props();

    let quest = $state(data.quest) as Quest;
    let user = data.user as User;
    let hash = $derived(parseInt(page.url.hash.slice(1) || 0));
    let troop = $state(data.troop) as {id: string, username: string, assigned: boolean}[]

    async function saveClues() {
        const form = new FormData();
        form.append('clues', JSON.stringify(quest.clues));
        const response = await fetch('?/save', {
            method: 'POST',
            body: form
        });
    }

    function newClue() {
        quest.clues.push({
            title: "New Clue",
            description: "New clue",
            answers: "answer",
            notes: "",
            location: "",
        })
        hash = quest.clues.length; // Set to the new clue's index
        page.url.hash = hash + '';
        replaceState(page.url.toString(), {})
        saveClues();
    }

    function prevClue() {
        page.url.hash = (--hash)+''
        replaceState(page.url.toString(), {})
    }
    function nextClue() {
        page.url.hash = (++hash)+''
        replaceState(page.url.toString(), {})
    }

    async function assignMember(id: string) {
        const form = new FormData();
        form.append('memberId', id);
        const response = await fetch('?/assign', {
            method: 'POST',
            body: form
        });
        if (response.ok) {
            // Update the troop state to reflect the assignment
            const member = troop.find(m => m.id === id);
            if (member) {
                member.assigned = true;
            }
        } else {
            console.error("Failed to assign member:", response.statusText);
        }
    }

    async function deAssignMember(id: string) {
        const form = new FormData();
        form.append('memberId', id);
        const response = await fetch('?/deAssign', {
            method: 'POST',
            body: form,
        })
        if (response.ok) {
            // (optimistically) Update the troop state to reflect the de-assignment
            const member = troop.find(m => m.id === id);
            if (member) {
                member.assigned = false;
            }
        } else {
            console.error("Failed to de-assign member:", response.statusText);
        }
    }
</script>


<div class="m-4 bg-white rounded-lg p-4">
    {#each troop as member}
        <div class="flex items-center gap-4">
            <p>{member.username}</p>
            <button hidden={member.assigned} onclick={()=>assignMember(member.id)} class="p-2 bg-blue-100 rounded-lg">Assign</button>
            <button hidden={!member.assigned} onclick={()=>deAssignMember(member.id)} class="p-2 bg-red-100 rounded-lg">Remove</button>
        </div>
    {/each}
</div>

<div class="m-4 flex gap-4 items-center justify-center w-full border border-gray-200 rounded-2xl">
    <div class="w-16 hidden md:block">
        <button disabled={hash === 0} class="text-4xl bg-white disabled:bg-gray-200 p-4 border-gray-100 border-2 shadow-2xl rounded-lg font-extrabold" onclick="{prevClue}"> &lt; </button>
    </div>

    <form hidden="{hash !== 0}" class="m-4 bg-white rounded-lg p-4" onchange={(e)=>{e.currentTarget.submit()}} method="post" action="?/update" use:enhance>
        <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">Quest Name</label>
            <input type="text" id="name" name="name" value={quest.title} class="p-1 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required>
        </div>
        <div class="mb-4">
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" name="description" rows="4" class="p-1 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required>{quest.description}</textarea>
        </div>
    </form>
    {#each quest.clues as clue, index}
        <div class="bg-white p-10 rounded-lg flex" hidden="{hash !== index + 1}">
            <div>
                <!--            location?-->
            </div>
            <div><div class="mb-4">
                <label for="clue-{index}" class="block text-sm font-medium text-gray-700">Clue Title</label>
                <input oninput={saveClues} type="text" id="clue-{index}" name="clues[{index}]" bind:value={clue.title} class="p-1 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
            </div>
                <div class="mb-4">
                    <label for="clue-description-{index}" class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea oninput={saveClues} id="clue-description-{index}" name="clues[{index}].description" bind:value={clue.description} rows="2" class="p-1 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"></textarea>
                </div>
                <div class="mb-4">
                    <label for="clue-answers-{index}" class="block text-sm font-medium text-gray-700">Answers (one per line)</label>
                    <textarea oninput={saveClues} id="clue-answers-{index}" name="clues[{index}].answers" bind:value={clue.answers} rows="2" class="p-1 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"></textarea>
                </div>
            </div>
        </div>
    {/each}
    <div class="w-16 hidden md:block">
        <button disabled={hash === quest.clues.length} class="text-4xl bg-white disabled:bg-gray-200 p-4 border-gray-100 border-2 shadow-2xl rounded-lg font-extrabold" onclick={nextClue}> &gt; </button>
    </div>
</div>
<div class="flex gap-8 m-4 items-center">
    <div class="w-16 md:hidden">
        <button disabled={hash === 0}                   class="text-4xl bg-white disabled:bg-gray-200 px-4 py-2 border-gray-100 border-2 shadow-2xl rounded-lg font-extrabold" onclick="{prevClue}"> &lt; </button>
    </div>
    <div>{hash}/{quest.clues.length}</div>
    <div class="w-16 md:hidden">
        <button disabled={hash === quest.clues.length}  class="text-4xl bg-white disabled:bg-gray-200 px-4 py-2 border-gray-100 border-2 shadow-2xl rounded-lg font-extrabold" onclick={nextClue}> &gt; </button>
    </div>
</div>

<form>
    <button onclick={newClue} class="bg-blue-500 text-white p-2 rounded-md">Add Clue</button>
</form>