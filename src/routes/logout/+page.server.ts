import type { PageServerLoad } from "./$types"
import {redirect} from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
    event.cookies.set("pb_auth", "", {path: "/"})

    redirect(301, '/')
};