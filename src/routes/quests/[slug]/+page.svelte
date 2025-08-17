<script lang="ts">
    import { enhance } from '$app/forms';

    import type {PageServerData} from "./$types";
    import {page} from "$app/state";
    import {replaceState} from "$app/navigation";

    let {data }: {data: PageServerData, } = $props();

    let quest = $derived(data.quest) as Quest;
    let hash = $derived(parseInt(page.url.hash.slice(1) || quest.clues.length-1));

    function prevClue() {
        page.url.hash = (--hash)+''
        replaceState(page.url.toString(), {})
    }
    function nextClue() {
        page.url.hash = (++hash)+''
        replaceState(page.url.toString(), {})
    }
</script>



<div class="m-4 flex gap-4 items-center">
    <div class="w-16">
        <button disabled={hash === 0} class="text-4xl bg-white disabled:bg-gray-200 p-4 rounded-lg" onclick="{prevClue}"> ⮜ </button>
    </div>
    {#each quest.clues as clue, index}
        <div class="bg-white p-10 rounded-lg flex" hidden="{hash !== index}">
            <div>
                <!--            location?-->
            </div>
            <div><div class="mb-4 font-semibold">
                {clue.title}
            </div>
                <div class="mb-4">
                    {clue.description}
                </div>
                <form class="mb-4" method="post" action="?/check">
                    <label for="clue-answer-{index}" class="block text-sm font-medium text-gray-700">Clue Answer</label>
                    <input hidden name="clueId" value="{index}" />
                    <input type="text" name="clue-answer-{index}" id="clue-answer-{index}" class="p-2 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                    <button type="submit" class="mt-2 bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    {/each}
    <div class="w-16">
        <button disabled={hash === quest.clues.length-1} class="text-4xl bg-white disabled:bg-gray-200 p-4 rounded-lg" onclick={nextClue}> ⮞ </button>
    </div>
</div>