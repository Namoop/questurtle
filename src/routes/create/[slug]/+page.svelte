<script lang="ts">

    import type {PageServerData} from "./$types";
    import {enhance} from '$app/forms';
    import {onMount} from 'svelte';
    import {page} from "$app/state";
    import {replaceState} from "$app/navigation";
    import {Carta, MarkdownEditor} from 'carta-md';
    import 'carta-md/default.css';
    import DOMPurify from 'isomorphic-dompurify';

    let {data}: { data: PageServerData } = $props();

    let quest = $state(data.quest) as Quest;
    let user = data.user as User;
    let hash = $derived(parseInt(page.url.hash.slice(1) || 0));
    let troop = $state(data.troop) as { id: string, username: string, assigned: boolean }[]

    const editorOptions = {
        sanitizer: DOMPurify.sanitize,
    };

    const descEditor = new Carta(editorOptions);
    const clueEditor = new Carta(editorOptions);

    async function saveClues() {
        const form = new FormData();
        form.append('clues', JSON.stringify(quest.clues));
        const response = await fetch('?/save', {
            method: 'POST',
            body: form
        });
    }

    async function saveQuest() {
        const form = new FormData();
        form.append('title', quest.title);
        form.append('description', quest.description);
        const response = await fetch('?/saveQuest', {
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
        hash = quest.clues.length-1; // Set to the new clue's index
        page.url.hash = hash + '';
        replaceState(page.url.toString(), {})
        saveClues();
    }

    function prevClue() {
        page.url.hash = (--hash) + ''
        replaceState(page.url.toString(), {})
    }

    function nextClue() {
        page.url.hash = (++hash) + ''
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

    async function delClue() {
        if (hash === 0) return; // Safety check
        if (!confirm("Are you sure you want to delete this clue? This action cannot be undone.")) return;
        quest.clues.splice(hash - 1, 1);
        hash = Math.max(0, hash - 1); // Move to the previous clue or stay at 0
        page.url.hash = hash + '';
        replaceState(page.url.toString(), {})
        await saveClues();
    }

    let showDesc = $state(false);
</script>

<style>
    /* Set your monospace font  */
    /* Required to have the editor working correctly! */
    :global(.carta-font-code) {
        font-family: '...', monospace;
        font-size: 1.1rem;
        /*line-height: 1.1rem;*/
        letter-spacing: normal;
    }
    :global(.carta-renderer) {
        white-space: pre-wrap;
    }
</style>

<div class="m-4 bg-white rounded-lg p-4">
    {#each troop as member}
        <div class="flex items-center gap-4">
            <p>{member.username}</p>
            <button hidden={member.assigned} onclick={()=>assignMember(member.id)} class="p-2 bg-blue-100 rounded-lg">
                Assign
            </button>
            <button hidden={!member.assigned} onclick={()=>deAssignMember(member.id)} class="p-2 bg-red-100 rounded-lg">
                Remove
            </button>
        </div>
    {/each}
</div>

<div class="overflow-hidden {showDesc ? '' : 'h-20'} w-full">
<form onchange={saveQuest} class="m-4 bg-white rounded-lg p-4 w-full">
    <div class="mb-4 flex gap-4 w-full">
        <input type="text" id="name" name="name" bind:value={quest.title}
               class="p-1 mt-1 block w-full font-bold text-2xl text-center outline-none focus:underline underline-offset-10"
               required>
        <div class="h-4">
            <button class="py-2 bg-gray-200 rounded-full w-10" onclick="{()=>showDesc = !showDesc}">{showDesc ? '⌃' : '⌄'}</button>
        </div>
    </div>
    <div class="mb-4 w-full">
        <span class="block text-sm font-medium text-gray-700">Description</span>
        <MarkdownEditor mode="tabs" bind:value={quest.description} carta={descEditor}/>
    </div>
</form>
</div>

<div class="m-4 flex flex-col gap-4 items-center justify-center w-full">
    <div class="mb-4 w-full text-center">
        <input placeholder="clue title" oninput={saveClues} type="text" id="clue-title"
               name="clue_title" bind:value={quest.clues[hash].title}
               class="p-1 mt-1 block w-full border-gray-300 rounded-md shadow-sm text-xl font-semibold focus:border-blue-500 focus:ring-blue-500">
    </div>
    <form onchange={saveClues} class="w-full">
        <MarkdownEditor mode="tabs" carta={clueEditor} bind:value={quest.clues[hash].description}/>
    </form>
    <div class="mb-4">
        <label for="clue-answers" class="block text-sm font-medium text-gray-700">Answers (one per
            line)</label>
        <textarea oninput={saveClues} id="clue-answers" name="clue.answers"
                  bind:value={quest.clues[hash].answers} rows="2"
                  class="p-1 mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"></textarea>
    </div>
    </div>
    <div class="flex flex-col items-center sticky bottom-0 bg-white pb-2 w-full border-t-1 border-gray-300">
        <div class="flex gap-8 m-4 items-center">
            <div class="w-16">
                <button disabled={hash === 0}
                        class="text-4xl bg-white disabled:bg-gray-200 px-4 py-2 border-gray-100 border-2 shadow-2xl rounded-lg font-extrabold"
                        onclick="{prevClue}"> &lt;
                </button>
            </div>
            <div>{hash}/{quest.clues.length-1}</div>
            <div class="w-16">
                <button disabled={hash === quest.clues.length - 1}
                        class="text-4xl bg-white disabled:bg-gray-200 px-4 py-2 border-gray-100 border-2 shadow-2xl rounded-lg font-extrabold"
                        onclick={nextClue}> &gt;
                </button>
            </div>
        </div>
        <form>
            {#if hash > 0}
                <button onclick={delClue} class="bg-red-500 text-white p-2 rounded-md">Remove</button>
            {/if}
            <button onclick={newClue} class="bg-blue-500 text-white p-2 rounded-md">Add Clue</button>
        </form>
    </div>
