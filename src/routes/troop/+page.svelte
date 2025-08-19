<script lang="ts">
    import type {PageServerData} from "./$types";
    import {page} from "$app/state";
    import QRCode from 'qrcode'
    import {onMount} from "svelte";

    let {data }: {data: PageServerData } = $props();

    type USER = {
        id: string;
        username: string;
    }

    let userid = $state(data.userid || '');
    let troop = $state(data.troop) as USER[];

    let just_added = page.url.hash.slice(1);

    let qrdata = $state('');
    const generateQR = async (text: string) => {
        try {
            console.log(await QRCode.toDataURL(text))
        } catch (err) {
            console.error(err)
        }
    }
    const troopURL = page.url.origin + '/troop/' + userid + "/"
    onMount(async () => {
        if (userid) {
            qrdata = await QRCode.toDataURL(troopURL);
        }
    });

    function copyURL () {
        navigator.clipboard.writeText(troopURL).then(() => {
            console.log('URL copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy URL: ', err);
        });
    }
</script>

<div class="flex flex-col max-w-md items-center text-center">
    <img src={qrdata} alt="QR Code" class="mb-4 rounded-xl w-48" />
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
    <div>
        <p>{user.username}</p>
    </div>
{/each}