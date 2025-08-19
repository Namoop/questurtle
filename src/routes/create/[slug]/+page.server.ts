import type {PageServerLoad} from "./$types";
import {db} from "$lib/server/db";
import {quests, user} from "$lib/server/db/schema";
import {and, eq, or, sql} from "drizzle-orm";

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

    const userData = await db
        .select()
        .from(user)
        .where(eq(user.id, userId))
    if (userData.length === 0) return {};

    const troopIds = userData[0].troop as string[];
    const troop = await db
        .select()
        .from(user)
        .where(or(eq(user.id, ''), ...troopIds.map(id=>eq(user.id, id))))

    return {
        quest,
        // quest: {
        //     ...quest,
        //     // clues: JSON.parse(quest.clues as string) as Clue[], // Assuming you have a Clue type defined
        // } as Quest,
        troop: troop.map(u => ({
            id: u.id, username: u.username, assigned: (u.quests as Quest[]).map((q: { id: any; })=>q.id).includes(questId),
        }))
    };
};

export const actions = {
    update: async (event) => {
        const formData = await event.request.formData();
        const questId = event.params.slug;
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;

        if (!event.locals.user) {
            return { success: false, error: "You must be logged in to update a quest." };
        }

        const userId = event.locals.user.id;

        // Update the quest in the database
        const result = await db
            .update(quests)
            .set({ name, description })
            .where(and(eq(quests.id, questId), eq(quests.author, userId)))
            .returning();

        if (result.length > 0) {
            return { success: true, quest: result[0] };
        } else {
            return { success: false, error: "Failed to update quest." };
        }
    },
    save: async (event) => {
        const formData = await event.request.formData();
        const questId = event.params.slug;
        const clues = JSON.parse(formData.get('clues') as string);

        if (!event.locals.user) {
            return { success: false, error: "You must be logged in to update a quest." };
        }

        const userId = event.locals.user.id;
        const result = await db
            .update(quests)
            .set({ clues })
            .where(and(eq(quests.id, questId), eq(quests.author, userId)))
            .returning();

        if (result.length > 0) {
            return { success: true, quest: result[0] };
        }
        return { success: false, error: "Failed to update quest." };
    },
    assign: async (event) => {
        const formData = await event.request.formData();
        const questId = event.params.slug;
        const memberId = formData.get('memberId') as string;

        const member = await db
        .select()
        .from(user)
        .where(eq(user.id, memberId))

        const result = await db
            .update(user)
            .set({quests: sql`json_insert(quests, '$[#]', json(${JSON.stringify({id: questId, progress: 0})}))`})
            .where(eq(user.id, memberId))
            .returning()
        // TODO assure unique

        if (result.length > 0) {
            return { success: true, quest: result[0] };
        } else {
            return { success: false, error: "Failed to assign the quest." };
        }
    },
    deAssign: async (event) => {
        const formData = await event.request.formData();
        const questId = event.params.slug;
        const memberId = formData.get('memberId') as string;

        const member = await db
        .select()
        .from(user)
        .where(eq(user.id, memberId))

        const result = await db
        .update(user)
        .set({quests: sql`json_remove(quests, '$[?(@.id == ${questId})]')`})
        .where(eq(user.id, memberId))
        .returning()

        if (result.length < 0) {
            return { success: false, error: "Failed to de-assign the quest." };
        }
        return { success: true, quest: result[0] };
    }
};