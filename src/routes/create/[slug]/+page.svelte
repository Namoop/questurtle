<script lang="ts">

    import type {PageServerData} from "./$types";

    let {data}: { data: PageServerData } = $props();
</script>

{data.quest.id}