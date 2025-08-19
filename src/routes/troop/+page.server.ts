import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import type {PageServerLoad} from "./$types";
import {eq, or} from "drizzle-orm";

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

        const troopIds = userData[0].troop as string[];

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
