import { Elysia, NotFoundError, t } from 'elysia'

import { prisma } from '../services/prisma'


export const router = new Elysia()
    .get(
        '/',
        async () => {
            return 'hi'
        }
    )