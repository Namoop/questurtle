import type {PageServerLoad} from "./$types";
import { pb, requireLogin} from "$lib";

export const load: PageServerLoad = async (event) => {
    // fetch the user's assigned quests from the database
    const user = await requireLogin()
    user.assigned = user.assigned || []

    const shared = (await pb.collection("turtlequests").getFullList({
        filter: `shared.id ?= "${user.id}"`,
        expand: 'author'
    })).filter(q => !user.assigned.find((a: any) => a.id === q.id)) // filter out already accepted quests

    const assigned = await pb.collection("turtlequests").getFullList({
        filter: user.assigned.map(a=>`id="${a.id}"`).join(' || ') || 'id=0',
    })

    // hide clues based on progress


    return {
        user: {
            id: user.id, username: user.username,
        },
        shared: shared.map(q => ({
            id: q.id,
            title: q.title,
            description: q.description,
            author: q.expand?.author.username || 'Unknown',
        })),
        quests: assigned
    };

};

export const actions = {
    accept: async (event) => {
        const user = await requireLogin()
        const formData = await event.request.formData();
        const questId = formData.get('questId') as string;

        if (!pb.authStore.record) {
            return { success: false, error: "You must be logged in to accept a quest." };
        }

        user.assigned = user.assigned || [];
        if (user.assigned.find((q: any) => q.id === questId)) {
            return {success: false, error: "You have already accepted this quest."};
        }
        user.assigned.push({id: questId, progress: 0});
        await pb.collection("turtleusers").update(user.id, {
            assigned: user.assigned
        });
        return { success: true, message: "Quest accepted successfully." };
    }
}