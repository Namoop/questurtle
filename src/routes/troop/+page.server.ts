import { db } from '$lib/server/db';
import { quests, user } from '$lib/server/db/schema';
import type {PageServerLoad} from "./$types";
import {eq, or} from "drizzle-orm";
import {redirect} from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
    // fetch the user's assigned quests from the database
    if (!event.locals.user) {
        return {};
    }

        const userId = event.locals.user.id;
        const userData = await db
            .select()
            .from(user)
            .where(eq(user.id, userId))

        if (userData.length === 0) return {};

        const troopIds = JSON.parse(userData[0].troop as string) as string[];

        // fetch usernames
        const troop = await db
            .select()
            .from(user)
            .where(or(eq(user.id, ''), ...troopIds.map(id=>eq(user.id, id))))

        return {
            userid: event.locals.user.id,
            troop: troop.map(u => ({
                id: u.id, username: u.username,
            }))
        }

};

export const actions = {
    add: async (event) => {
        const formData = await event.request.formData();
        const troop = formData.get('troop') as string;

        if (!event.locals.user) {
            return { success: false, error: "You must be logged in to update your troop." };
        }

        const userId = event.locals.user.id;
        const result = await db
            .update(user)
            .set({troop})
            .where(eq(user.id, userId))
            .returning()



        if (result.length > 0) {
            return { success: true, quest: result[0] };
        }
        return { success: false, error: "Failed to assign the troop." };
    },
}