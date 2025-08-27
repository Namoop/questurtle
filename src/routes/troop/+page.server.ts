import type {PageServerLoad} from "./$types";
import {requireLogin} from "$lib";

export const load: PageServerLoad = async (event) => {
    // fetch the user's assigned quests from the database
    const {pb, user} = await requireLogin(event.cookies.get("pb_auth") || "", "troop");
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
        const {pb, user} = await requireLogin(event.cookies.get("pb_auth") || "");
        const formData = await event.request.formData();
        const memberId = formData.get('memberId') as string;
        if (!user.id) {
            return { success: false, error: "You must be logged in to remove a member." };
        }

        await pb.collection("turtleusers").update(user.id, {
            "troop-": [memberId]
        })
        await pb.collection("turtleusers").update(memberId, {
            "troop-": [user.id]
        });

        return { success: true, message: "Member removed successfully." };
    }
};