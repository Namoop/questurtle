import type {PageServerLoad} from "./$types";
import {requireLogin} from "$lib";

export const load: PageServerLoad = async (event) => {
    // fetch the user's assigned quests from the database
    const {pb, user} = await requireLogin(event.cookies.get("pb_auth") || "")
    const questId = event.params.slug;

    const progress = user.assigned.filter(q => q.id === questId)[0]?.progress || 0;

    const quest = await pb.collection('turtlequests').getOne(questId);

    return {
        quest: {
            ...quest,
            clues: quest.clues.slice(0, progress+1) as Clue[], // Assuming you have a Clue type defined
        } as unknown as Quest,
    };
};

export const actions = {
    check: async (event) => {
        const formData = await event.request.formData();
        const questId = event.params.slug;
        const clueId = parseInt(formData.get('clueId') as string);
        const answer = formData.get('clue-answer-'+ clueId) as string;
        const {pb, user} = await requireLogin(event.cookies.get("pb_auth") || "");
        const quest = await pb.collection('turtlequests').getOne(questId);

        const clues = quest.clues as Clue[];
        const clue = clues[clueId];
        const answers = clue.answers.split("\n").map(a=>a.toLowerCase());
        const correct = answers.includes(answer.toLowerCase());

        if (!correct) {
            return { success: false, error: "Incorrect answer." };
        }

        user.assigned = user.assigned || [];
        const questInfo = user.assigned.filter((q: any) => q.id === questId)[0];
        questInfo.progress = Math.max(questInfo.progress, clueId + 1);
        await pb.collection("turtleusers").update(user.id, {
            assigned: user.assigned
        });
        return { success: true };
    }
}