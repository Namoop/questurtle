<script lang="ts">
    import type {PageServerData} from "./$types";
    import {page} from "$app/state";
    import QRCode from 'qrcode'
    import {onMount} from "svelte";
    import {replaceState} from "$app/navigation";

    let {data }: {data: PageServerData } = $props();

    type USER = {
        id: string;
        username: string;
    }

    let userid = $state(data.userId || '');
    let troop = $state(data.troop) as USER[];

    let just_added = page.url.hash.slice(1);

    let qrdata = $state('');
    const troopURL = page.url.origin + '/troop/' + userid + "/"
    onMount(async () => {
        if (userid) {
            qrdata = await QRCode.toDataURL(troopURL);
            document.getElementById("qrcode")!.classList.remove("animate-pulse");
        }
        if (just_added) replaceState(page.url.origin + page.url.pathname, {}) // clear the hash
    });

    function copyURL () {
        navigator.clipboard.writeText(troopURL).then(() => {
            console.log('URL copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy URL: ', err);
        });
    }

    async function removeFromTroop(user: {id: string, username: string}) {
        const form = new FormData();
        form.append('memberId', user.id);
        await fetch('?/remove', {
            method: 'POST',
            body: form
        });
        // Remove the user from the troop state
        const lengthBefore = troop.length;
        troop = troop.filter(u => u.id !== user.id);
        if (troop.length !== lengthBefore) {
            alert(`${user.username} has been removed from your troop.`);
        }
    }
</script>

<div class="flex flex-col max-w-md items-center text-center">
    <img id="qrcode" src={qrdata} alt="QR Code" class="mb-4 rounded-xl w-48 h-48 bg-gray-400 animate-pulse" />
    <button onclick={copyURL} class="text-blue-500 underline mb-4 hover:scale-105 active:scale-100">
        Click to copy url
    </button>
    <p>Have another quester scan your QR code to join each other's troops and send each other on quests!</p>
</div>

{#if just_added}
    <div class="flex items-center justify-end flex-col m-4 p-4 bg-emerald-50 rounded-xl shadow-lg">
        <p class="font-semibold text-green-800">{just_added}</p>
        <p>has successfully been added to your troop!</p>
    </div>
{/if}

<hr class="border-b-1 border-black w-6/12 my-8">

<h1 class="font-semibold text-2xl mt-4">Troop</h1>
{#each troop as user}
    <div class="w-64 shadow-xl rounded-lg p-4 m-2 bg-white flex gap-4 items-center justify-between">
        <p class="font-semibold">{user.username}</p>
        <button class="bg-red-100 rounded-md py-1 px-2" onclick={()=>removeFromTroop(user)}>Remove :(</button>
    </div>
{/each}
{#if troop.length === 0}
    <p class="text-gray-500">Your troop is empty. Invite friends to join!</p>
{/if}