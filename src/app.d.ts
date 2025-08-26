// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/auth').SessionValidationResult['user'];
			session: import('$lib/server/auth').SessionValidationResult['session']
		}
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
} // interface PageData {}
// interface PageState {}

// interface Platform {}
export {};