import type {PageServerLoad} from "./$types";
import {pb, requireLogin} from "$lib";

export const load: PageServerLoad = async (event) => {
    // fetch the user's assigned quests from the database
    const user = await requireLogin('troop')
    return {
        userId: user.id,
        // @ts-ignore pocketbase returns the user with expand
        troop: user.expand ? user.expand.troop.map(u => ({
            id: u.id,
            username: u.username,
        })) : []
    }
};


export const actions = {
    remove: async (event) => {
        const formData = await event.request.formData();
        const memberId = formData.get('memberId') as string;
        const userId = pb.authStore.record?.id;
        if (!userId) {
            return { success: false, error: "You must be logged in to remove a member." };
        }

        await pb.collection("turtleusers").update(userId, {
            "troop-": [memberId]
        })
        await pb.collection("turtleusers").update(memberId, {
            "troop-": [userId]
        });

        return { success: true, message: "Member removed successfully." };
    }
};