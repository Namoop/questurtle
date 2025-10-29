<script lang="ts">
    import {enhance} from '$app/forms';

    import type {PageServerData} from "./$types";
    import {page} from "$app/state";
    import {goto, pushState, replaceState} from "$app/navigation";
    import {Carta, Markdown} from 'carta-md';
    import 'carta-md/default.css';
    import '@cartamd/plugin-code/default.css';
    import {code} from "@cartamd/plugin-code";

    let {data, form}: { data: PageServerData, form: { success: boolean } } = $props();

    let quest = $derived(data.quest) as Quest;
    let hash = $derived(parseInt(page.url.hash.slice(1) || quest.clues.length - 1));

    const carta = new Carta({extensions: [code()]});

    function prevClue() {
        page.url.hash = (--hash) + ''
        replaceState(page.url.toString(), {})
    }

    function nextClue() {
        page.url.hash = (++hash) + ''
        replaceState(page.url.toString(), {})
    }

    async function submit() {
        return async ({update}) => {
            await update();
        }
    }
</script>

<style>
    :global(.carta-viewer) {
        white-space: pre-wrap;
    }
    :global(.carta-viewer pre) {
        overflow-x: scroll;
    }
</style>

<div class="w-full m-4 flex gap-4 items-center justify-center max-w-xl">
    <div class="w-full bg-white">
        <div class="mb-4 font-semibold">
            {quest.clues[hash].title}
        </div>
        <div class="mb-4 w-full">
            {#key hash}
                <Markdown {carta} value={quest.clues[hash].description}/>
            {/key}
        </div>
        <form class="mb-4" method="post" action="?/check" use:enhance={submit} hidden={quest.complete || hash !== quest.clues.length - 1}>
            <label for="clue-answer" class="block text-sm font-medium text-gray-700">Clue Answer</label>
            <input type="hidden" name="index" value="{hash}" hidden>
            <input type="text" name="answer"
                   class="p-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
            <button type="submit"
                    class="mt-2 bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Submit
            </button>
        </form>
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
        <div>{hash}/{quest.clues.length - 1}</div>
        <div class="w-16">
            <button disabled={hash === quest.clues.length - 1}
                    class="text-4xl bg-white disabled:bg-gray-200 px-4 py-2 border-gray-100 border-2 shadow-2xl rounded-lg font-extrabold"
                    onclick={nextClue}> &gt;
            </button>
        </div>
    </div>
</div>