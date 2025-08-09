import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (params) => {
    const slug = params.url.pathname
    const user = requireLogin(slug)
    return { user };
};

function requireLogin(slug: string) {
    const { locals } = getRequestEvent();

    if (!locals.user && (slug !== "/" && slug !== "/login")) {
        return redirect(302, "/login");
    }

    return locals.user;
}
