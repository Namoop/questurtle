<script lang="ts">
    import { enhance } from '$app/forms';
    import type {PageServerData, ActionData} from "./$types";

    let {data, form }: {data: PageServerData, form: ActionData } = $props();

    type USER = {
        id: string;
        username: string;
    }

    let userid = $state(data.userid || '');
    let troop = $state(data.troop) as USER[];


    let new_member = $state('')
    async function addMember () {
        const users = troop.map(u => u.id)
        if (users.includes(new_member)) return false;

        const form = new FormData();
        form.append('troop', JSON.stringify(users.concat([new_member])));
        const response = await fetch('?/add', {
            method: 'POST',
            body: form
        });
    }
</script>

<!--add to troop-->
<label for="troop-add">Add to Troop</label>
<input bind:value={new_member} id="troop-add" type="text" class="bg-white p-2 rounded-md"/>
<button onclick={addMember} class="bg-blue-500 p-2 text-white rounded-md">Recruit Member</button>
<i class="mb-4"> Your code: {userid}</i>

<h1 class="font-semibold text-2xl">Troop</h1>
{#each troop as user}
    <div>
        <p>{user.username}</p>
    </div>
{/each}