// place files you want to import through the `$lib` alias in this folder.

import {env} from "$env/dynamic/private";
import Pocketbase from 'pocketbase';
import {redirect} from "@sveltejs/kit";
if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

export const pb = new Pocketbase(env.DATABASE_URL);

export async function requireLogin(expand = '') {
    if (!pb.authStore.isValid || !pb.authStore.record) {
        return redirect(302, "/auth")
    }
    const user = await pb.collection("turtleusers").getFirstListItem(`id="${pb.authStore.record.id}"`, {
        expand
    })
    return user as unknown as User;
}
