import type {PageServerLoad} from "./$types";
import {pb, requireLogin} from "$lib";

export const load: PageServerLoad = async (event) => {
    // fetch the user's created quests from the database
    const user = await requireLogin("troop")

    const questId = event.params.slug;

    const quest = await pb.collection("turtlequests")
        .getFirstListItem(`id = '${questId}' && author = '${user.id}'`)

    if (!quest) {
        throw new Error("Quest not found or you do not have permission to view it.");
    }

    return {
        user: {
            id: user.id, username: user.username,
        },
        quest,
        // @ts-ignore pocketbase expand
        troop: user.expand.troop.map(u => ({
            id: u.id, username: u.username, assigned: quest.shared.includes(u.id),
        }))
    };
};

export const actions = {
    update: async (event) => {
        const formData = await event.request.formData();
        const questId = event.params.slug;
        const title = formData.get('name') as string;
        const description = formData.get('description') as string;

        const userId = pb.authStore.record?.id;
        if (!userId) {
            return { success: false, error: "You must be logged in to update a quest." };
        }

        const result = await pb.collection("turtlequests").update(questId, {
            title, description
        })

        return { success: true, quest: result };
    },
    save: async (event) => {
        const formData = await event.request.formData();
        const questId = event.params.slug;
        const clues = JSON.parse(formData.get('clues') as string);

        const userId = pb.authStore.record?.id;
        if (!userId) {
            return { success: false, error: "You must be logged in to update a quest." };
        }

        const result = await pb.collection("turtlequests").update(questId, {
            clues
        })
    },
    assign: async (event) => {
        const formData = await event.request.formData();
        const questId = event.params.slug;
        const memberId = formData.get('memberId') as string;

        const result = await pb.collection("turtlequests").update(questId, {
            "shared+": [memberId]
        })
    },
    deAssign: async (event) => {
        const formData = await event.request.formData();
        const questId = event.params.slug;
        const memberId = formData.get('memberId') as string;

        const result = await pb.collection("turtlequests").update(questId, {
            "shared-": [memberId]
        })
    }
};