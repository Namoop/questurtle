import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	troop: text('troop', {mode: 'json'}).notNull().default('[]'), // JSON array of user IDs in the troop
	passwordHash: text('password_hash').notNull(),
	quests: text('quests', {mode: 'json'}).notNull().default('[]'), // accepted quests (IDs)
	pending: text('pending', {mode: 'json'}).notNull().default('[]'), // array of offered quests that the user has not yet accepted
	created: text('created', {mode: 'json'}).notNull().default('[]'), // array of quest IDs that the user has created
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const quests = sqliteTable('quests', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description').notNull(),
	author: text('author').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	clues: text('clues', {mode: 'json'}).notNull().default('[]'), // JSON array of clues
	public: integer('public').notNull().default(0), // 0 is private, 1 is limited, 2 is public
	shared: text('shared', {mode: 'json'}).notNull().default('[]'), // JSON array of user IDs who can access the quest
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
