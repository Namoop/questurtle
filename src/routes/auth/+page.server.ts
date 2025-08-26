import {fail, redirect} from '@sveltejs/kit';
import {pb, requireLogin} from '$lib';
import type {Actions, PageServerLoad} from './$types';

export const load: PageServerLoad = async (event) => {
    if (pb.authStore.isValid) {
        return redirect(302, '/quests');
    }
    return {};
};

export const actions: Actions = {
    login: async (event) => {
        const formData = await event.request.formData();
        const username = formData.get('username');
        const password = formData.get('password');

        if (!validateUsername(username)) {
            return fail(400, { message: 'Invalid username (min 3, max 31 characters, alphanumeric only)' });
        }
        if (!validatePassword(password)) {
            return fail(400, { message: 'Invalid password (min 6, max 255 characters)' });
        }

        const authData = await pb.collection('turtleusers').authWithPassword(username, password).catch((e) => {
            console.log(e);
            return fail(400, { message: 'Incorrect username or password' });
        });

        if (!authData) {
            return fail(400, { message: 'Incorrect username or password' });
        }

        return redirect(302, '/quests');
    },
    register: async (event) => {
        const formData = await event.request.formData();
        const username = formData.get('username');
        const password = formData.get('password');

        if (!validateUsername(username)) {
            return fail(400, { message: 'Invalid username' });
        }
        if (!validatePassword(password)) {
            return fail(400, { message: 'Invalid password' });
        }

        const existingUser = await pb.collection('turtleusers').getFirstListItem(`username="${username}"`).catch(() => null);
        if (existingUser) {
            return fail(400, { message: 'Username already exists' });
        }
        const user = await pb.collection('turtleusers').create({
            username,
            password,
            passwordConfirm: password,
        }).catch((e) => {
            console.log(e);
            return fail(500, { message: 'Failed to create user' });
        });

        // log in
        const authData = await pb.collection('turtleusers').authWithPassword(username, password).catch((e) => {
            console.log(e);
            return fail(400, { message: 'Failed to log in after registration' });
        });

        return redirect(302, '/quests');
    },
};


function validateUsername(username: unknown): username is string {
    return (
        typeof username === 'string' &&
        username.length >= 3 &&
        username.length <= 31 &&
        /^[a-z0-9_-]+$/.test(username)
    );
}

function validatePassword(password: unknown): password is string {
    return (
        typeof password === 'string' &&
        password.length >= 6 &&
        password.length <= 255
    );
}
