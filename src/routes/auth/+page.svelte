<script lang='ts'>
    import { enhance } from '$app/forms';
    import type { ActionData } from './$types';

    let { form }: { form: ActionData } = $props();
    let register = $state(false)
</script>

<main class="flex flex-col items-center py-8 px-4 gap-4 sm:mt-20 mt-10 m-auto max-w-lg border-1 border-dotted">
    <img src="/turtle.png" alt="Turtle Logo" class="w-20 mb-4">
    <h1 class="text-lg font-bold">{register ? 'Register for' : 'Login to'} Questurtle</h1>
    <form method="post" action="?/login" use:enhance class="flex flex-col gap-8">
        <div class="grid gap-y-2 md:gap-y-4 gap-x-2 md:grid-cols-2 items-center justify-center text-center">
            <label for="username">
                Username
            </label>
            <input
                    id="username"
                    name="username"
                    class="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
            />
            <label for="password">
                Password
            </label>
            <input
                    type="password"
                    id="password"
                    name="password"
                    class="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
            />
            {#if register}
                <label for="confirmPassword">
                    Confirm Password
                </label>
                <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        class="mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                />
            {/if}
        </div>

        {#if !register}
            <button type="submit" class="w-1/2 m-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Login</button>
        {:else}
            <button formaction="?/register" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Register</button>
        {/if}
        <button type="button" class="text-sm text-blue-600 hover:underline cursor-pointer" onclick={() => {register = !register; form = null;}}>
            {register ? 'Already have an account? Login' : "Don't have an account? Register"}
        </button>
    </form>
    <p style='color: red'>{form?.message ?? ''}</p>
</main>