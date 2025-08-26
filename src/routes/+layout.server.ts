import { fail, redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
import type { LayoutServerLoad } from './$types';
import {pb, requireLogin} from "$lib";

export const load: LayoutServerLoad = async (params) => {
    // const slug = params.url.pathname
    // const url = params
    // if (params.url.pathname === '/' || params.url.pathname === '/auth') return {};
};