import type {PageServerLoad} from "./$types";
import {redirect} from "@sveltejs/kit";
import {requireLogin} from "$lib";

export const load: PageServerLoad = async (event) => {
    // fetch the user's created quests from the database
    const {pb, user} = await requireLogin(event.cookies.get("pb_auth") || "");

    const results = await pb.collection("turtlequests").getFullList({
        filter: `author.id = "${user.id}"`,
        sort: 'created'
    })

    return {
        my_quests: results
    };

};

export const actions = {
    create: async (event) => {
        const {pb, user} = await requireLogin(event.cookies.get("pb_auth") || "");

        const result = await pb.collection("turtlequests").create({
            title: "New Quest",
            description: "This is a new quest.",
            author: user.id,
            clues: [],
        })
        return {success: true, quest: result};

    }
};