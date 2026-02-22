import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().min(2),
        companyName: z.string().min(2),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(1),
        companySlug: z.string().optional(),
    }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
