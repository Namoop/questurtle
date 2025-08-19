import { db } from '$lib/server/db';
import { quests, user } from '$lib/server/db/schema';
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
    const assigned = userData[0].quests as {id: string, progress: number }[];

    const results = await db
        .select()
        .from(quests)
        .where(or(eq(quests.id,''),...assigned.map(a=>eq(quests.id, a.id))))
        .orderBy(quests.createdAt) as Quest[];

    return {
        my_quests: results
    };

};