
import { db } from '$lib/server/db';
import { quests } from '$lib/server/db/schema';
import type {PageServerLoad} from "./$types";
import {eq} from "drizzle-orm";
import {redirect} from "@sveltejs/kit";
import {encodeBase32LowerCase} from "@oslojs/encoding";

export const load: PageServerLoad = async (event) => {
    // fetch the user's created quests from the database
    if (!event.locals.user) {
        return {};
    }

    const userId = event.locals.user.id;
    const results = await db
        .select()
        .from(quests)
        .where(eq(quests.author, userId))
        .orderBy(quests.createdAt) as Quest[];

    return {
        my_quests: results
    };

};

export const actions = {
    create: async (event) => {
        const newQuest = {
            name: "New Quest",
            description: "This is a new quest.",
            id: encodeBase32LowerCase(crypto.getRandomValues(new Uint8Array(15))),
            author: event.locals.user?.id,
            createdAt: new Date(),
        } as Quest;

        const result = await db.insert(quests).values(newQuest).returning();
        if (result.length > 0) {
            const createdQuest = result[0];
            redirect(302, '/create/' + createdQuest.id);
            // return { success: true, quest: createdQuest };
        } else {
            return { success: false, error: "Failed to create quest." };
        }
    }
};