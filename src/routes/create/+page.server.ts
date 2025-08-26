import type {PageServerLoad} from "./$types";
import {redirect} from "@sveltejs/kit";
import {pb, requireLogin} from "$lib";

export const load: PageServerLoad = async (event) => {
    // fetch the user's created quests from the database
    const user = await requireLogin();

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
        if (!pb.authStore.record) return {success: false, error: "You must be logged in to create a quest."};
        const result = await pb.collection("turtlequests").create({
            title: "New Quest",
            description: "This is a new quest.",
            author: pb.authStore.record.id,
            clues: [],
        })
        return {success: true, quest: result};

    }
};