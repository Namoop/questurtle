import type { PageServerLoad } from "./$types"
import {pb} from "$lib";
import {redirect} from "@sveltejs/kit";

export const load: PageServerLoad = async (params) => {
    pb.authStore.clear()

    redirect(301, '/')
};