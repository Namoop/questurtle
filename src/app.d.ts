// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/auth').SessionValidationResult['user'];
			session: import('$lib/server/auth').SessionValidationResult['session']
		}
	} // interface Error {}
	// interface Locals {}

	type Clue = {
		title: string;
		description: string;
		answers: string;
		notes: string;
		location: string;
	}

	type Quest = {
		id: string;
		name: string;
		description: string;
		author: string;
		clues: Clue[];
		createdAt: Date;
	}
} // interface PageData {}
// interface PageState {}

// interface Platform {}
export {};