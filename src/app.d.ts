// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	type User = {
		id: string,
		username: string,
		email: string,
		troop: string[],
		quests: {
			id: string,
			progress: number
		}[],
		assigned: {
			id: string,
			progress: number
		}[]
	}
	type Quest = {
		id: string,
		title: string,
		description: string,
		clues: Clue[]
	}
	type Clue = {
		id: string,
		description: string,
		answers: string,
	}
}

export {};

