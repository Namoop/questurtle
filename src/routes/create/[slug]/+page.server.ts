import type {PageServerLoad} from "./$types";
import {db} from "$lib/server/db";
import {quests} from "$lib/server/db/schema";
import {and, eq} from "drizzle-orm";

export const load: PageServerLoad = async (event) => {
    // fetch the user's created quests from the database
    if (!event.locals.user) {
        return {};
    }

    const questId = event.params.slug;
    const userId = event.locals.user.id;

    const results = await db
        .select()
        .from(quests)
        .where(and(eq(quests.id, questId), eq(quests.author, userId)));

    if (results.length === 0) {
        throw new Error("Quest not found or you do not have permission to view it.");
    }

    const quest = results[0];

    return {
        quest: {
            ...quest,
            // clues: JSON.parse(quest.clues) as Clue, // Assuming you have a Clue type defined
        }
    };


};