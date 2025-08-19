import type {PageServerLoad} from "./$types";
import {db} from "$lib/server/db";
import {quests, user} from "$lib/server/db/schema";
import {and, eq, or} from "drizzle-orm";

export const load: PageServerLoad = async (event) => {
    // fetch the user's assigned quests from the database
    if (!event.locals.user) {
        return {};
    }
    const questId = event.params.slug;
    const userId = event.locals.user.id;

    const userData = await db
    .select()
    .from(user)
    .where(eq(user.id, userId))

    const questData = userData[0].quests as {id: string, progress: number }[];
    if (!questData.map(q => q.id).includes(questId)) return {}

    const results = await db
        .select()
        .from(quests)
        .where(eq(quests.id, questId));

    if (results.length === 0) {
        throw new Error("Quest not found or you do not have permission to view it.");
    }

    const quest = results[0] as Quest;
    const progress = questData.filter(q => q.id === questId)[0].progress;


    return {
        quest: {
            ...quest,
            clues: quest.clues.slice(0, progress+1) as Clue[], // Assuming you have a Clue type defined
        } as Quest,
    };
};

export const actions = {
    check: async (event) => {
        const formData = await event.request.formData();
        const questId = event.params.slug;
        const clueId = parseInt(formData.get('clueId') as string);
        const answer = formData.get('clue-answer-'+ clueId) as string;
        const userId = event.locals.user!.id;

        // fetch quest
        const quest = await db
            .select()
            .from(quests)
            .where(eq(quests.id, questId))

        const clues = JSON.parse(quest[0].clues as string) as Clue[];
        const clue = clues[clueId]
        const answers = clue.answers.split("\n");

        const correct = answers.includes(answer);

        if (!correct) {
            return { success: false, error: "Incorrect answer." };
        }

        // fetch user data to update progress
        const userData = await db
            .select()
            .from(user)
            .where(eq(user.id, userId));

        const questData = JSON.parse(userData[0].quests as string) as {id: string, progress: number }[];
        const questInfo = questData.filter(q => q.id === questId)[0]
        questInfo.progress = Math.max(questInfo.progress, clueId + 1)

        // save to db
        await db
            .update(user)
            .set({quests: questData})
            .where(eq(user.id, userId))
            .returning();

        return { success: true };
    }
}