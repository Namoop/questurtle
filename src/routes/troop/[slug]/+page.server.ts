import type {PageServerLoad} from "./$types";
import {redirect} from "@sveltejs/kit";
import {requireLogin} from "$lib";

export const load: PageServerLoad = async (event) => {
    const {pb, user} = await requireLogin(event.cookies.get("pb_auth") || "");
    const memberID = event.params.slug;

    const result2 = await pb.collection("turtleusers").update(user.id, {
        'troop+': [memberID]
    })
    const result1 = await pb.collection("turtleusers").update(memberID, {
        'troop+': [user.id]
    })

    redirect(301, '/troop#' + result1.username);
};