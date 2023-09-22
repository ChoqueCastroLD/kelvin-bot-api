import { Elysia } from 'elysia'
import { readdir } from 'node:fs/promises';


export const router = async (app: Elysia) => {
    const files = await readdir(`./src/api`);
    for (const file of files) {
        const { router } = await import(`./api/${file}`);
        if (!router) continue;
        console.log(`Loading route: ${file}`);
        app.group('', app => app.use(router));
    }
    return app;
}