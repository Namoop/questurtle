import {db} from '$lib/server/db';
import {quests, user} from '$lib/server/db/schema';
import type {PageServerLoad} from "./$types";
import {eq, or, sql} from "drizzle-orm";
import {redirect} from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
    // fetch the user's assigned quests from the database
    if (!event.locals.user) {
        return {};
    }

    const member = event.params.slug;

    if (!event.locals.user)
        return {};

    const userId = event.locals.user.id;
    const result = await db
        .update(user)
        .set({
            troop: sql`json_insert
            (troop, '$[#]',
            ${member}
            )`
        })
        .where(eq(user.id, userId))
        .returning();

    const result2 = await db
        .update(user)
        .set({
            troop: sql`json_insert
            (troop, '$[#]',
            ${userId}
            )`
        })
        .where(eq(user.id, member))
        .returning();

    redirect(301, '/troop#' + result2[0].username);
};